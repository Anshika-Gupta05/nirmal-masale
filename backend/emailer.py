"""Order-confirmation emails, sent over plain SMTP (standard library only - no new packages).

Configure in backend/.env (see .env.example). If SMTP_HOST is not set, emails are simply
skipped and orders still work, so local development needs no mail setup.
"""
from __future__ import annotations

import logging
import os
import re
import smtplib
import ssl
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import formataddr
from html import escape
from typing import Any
from urllib.parse import quote

from dotenv import load_dotenv

load_dotenv()

# Reuse uvicorn's logger so success / failure lines show up in the `python main.py` terminal.
log = logging.getLogger("uvicorn.error")

# Deliberately strict: no whitespace, quotes, commas, angle brackets -> no header injection.
_EMAIL_RE = re.compile(r"^[^@\s<>\"',;]+@[^@\s<>\"',;]+\.[^@\s<>\"',;]+$")

PAYMENT_LABELS = {"cod": "Cash on Delivery", "online": "Online (UPI / Card)"}

# Brand colours (same palette as the website)
INK, GOLD, GOLD_SOFT, IVORY, CREAM = "#1A100C", "#B8924A", "#D9B872", "#F3E9D6", "#FBF6EA"


def is_valid_email(value: str | None) -> bool:
    return bool(value) and len(value.strip()) <= 254 and bool(_EMAIL_RE.match(value.strip()))


def email_configured() -> bool:
    return bool(os.getenv("SMTP_HOST"))


def _inr(amount: float) -> str:
    amount = float(amount)
    return f"₹{int(amount):,}" if amount.is_integer() else f"₹{amount:,.2f}"


def _track_url(order_number: str) -> str:
    base = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    return f"{base}/track-order?order={quote(order_number)}"


def _site() -> str:
    return os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")


def _abs_url(path: str) -> str:
    """Product images are stored as '/products/x.png'; emails need absolute URLs."""
    if not path:
        return ""
    return path if path.startswith("http") else f"{_site()}/{path.lstrip('/')}"


def _ist_now() -> datetime:
    return datetime.now(timezone(timedelta(hours=5, minutes=30)))


def _day(d: datetime) -> str:
    return f"{d.strftime('%a')}, {d.day} {d.strftime('%b')}"


def _delivery_window() -> str:
    """Estimated delivery, e.g. 'Thu, 5 Nov - Sun, 8 Nov'. Tune with DELIVERY_DAYS_MIN / DELIVERY_DAYS_MAX."""
    lo = int(os.getenv("DELIVERY_DAYS_MIN", "4"))
    hi = int(os.getenv("DELIVERY_DAYS_MAX", "7"))
    now = _ist_now()
    return f"{_day(now + timedelta(days=lo))} - {_day(now + timedelta(days=hi))}"


def _attach_images(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Look up each product's image so the email can show thumbnails. Never raises."""
    try:
        from database import get_products_collection

        coll = get_products_collection()
        out = []
        for i in items:
            item = dict(i)
            if not item.get("image_url"):
                doc = coll.find_one({"name": item.get("product_name")})
                if doc:
                    item["image_url"] = doc.get("image_url") or doc.get("image") or ""
            out.append(item)
        return out
    except Exception:
        log.warning("Could not look up product images for the email; sending without thumbnails", exc_info=True)
        return items


def build_message(order: dict[str, Any]) -> EmailMessage:
    """`order` keys: order_number, first_name, last_name, email, items, total_amount,
    shipping_address, payment_method, phone (optional). Items may carry `image_url`."""
    order_number: str = order["order_number"]
    items: list[dict[str, Any]] = order.get("items", [])
    total = float(order["total_amount"])
    subtotal = sum(float(i["price"]) * int(i["quantity"]) for i in items)
    shipping = round(total - subtotal, 2)
    name = f'{order.get("first_name", "")} {order.get("last_name", "")}'.strip() or "there"
    first = (order.get("first_name") or "").strip() or "there"
    address = order.get("shipping_address") or ""
    phone = (order.get("phone") or "").strip()
    is_cod = (order.get("payment_method") or "") == "cod"
    payment_label = "Pay on delivery (Cash)" if is_cod else "Paid online (UPI / Card)"
    amount_label = "To pay on delivery" if is_cod else "Amount paid"
    track_url = _track_url(order_number)
    shipping_text = "FREE" if shipping <= 0 else _inr(shipping)
    placed_on = f"{_ist_now().day} {_ist_now().strftime('%b %Y')}"
    eta = _delivery_window()
    units = sum(int(i["quantity"]) for i in items)

    # ---------------- plain-text version ----------------
    lines = [
        f"Hi {first},",
        "",
        "Your order has been placed successfully! Thank you for shopping with Nirmal Gold Masale.",
        "",
        f"Order ID: {order_number}",
        f"Order date: {placed_on}",
        f"Estimated delivery: {eta}",
        f"Payment: {payment_label}",
        f"Track your order: {track_url}",
        "",
        "ITEMS",
    ]
    for i in items:
        lines.append(f'- {i["product_name"]} ({i["weight"]}) x {i["quantity"]}: {_inr(float(i["price"]) * int(i["quantity"]))}')
    lines += ["", f"Item total: {_inr(subtotal)}", f"Delivery: {shipping_text}", f"{amount_label}: {_inr(total)}"]
    if address:
        lines += ["", "DELIVERING TO", name, address] + ([f"Mobile: {phone}"] if phone else [])
    lines += ["", "Questions? Just reply to this email.", "", "- Team Nirmal Gold Masale"]
    text_body = "\n".join(lines)

    # ---------------- HTML version (inline styles + tables for email clients) ----------------
    e = escape  # every customer-supplied value goes through this
    F = "Helvetica,Arial,sans-serif"
    GREEN, GREY, LINE = "#1E8E5A", "#6B6B6B", "#EAEAEA"

    def item_row(i: dict[str, Any]) -> str:
        img = _abs_url(i.get("image_url", ""))
        thumb = (
            f'<img src="{e(img)}" alt="" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:contain;border:1px solid {LINE};border-radius:8px;background:#FBF6EA;">'
            if img
            else f'<div style="width:72px;height:72px;border:1px solid {LINE};border-radius:8px;background:{CREAM};text-align:center;line-height:72px;font-size:26px;color:{GOLD};font-family:Georgia,serif;">{e(str(i["product_name"])[:1].upper())}</div>'
        )
        line_total = float(i["price"]) * int(i["quantity"])
        return f"""<tr>
          <td width="88" valign="top" style="padding:16px 0;border-bottom:1px solid {LINE};">{thumb}</td>
          <td valign="top" style="padding:16px 12px;border-bottom:1px solid {LINE};font-family:{F};">
            <div style="font-size:15px;font-weight:bold;color:{INK};line-height:1.35;">{e(str(i["product_name"]))}</div>
            <div style="font-size:13px;color:{GREY};margin-top:4px;">Pack: {e(str(i["weight"]))} &nbsp;|&nbsp; Qty: {e(str(i["quantity"]))}</div>
          </td>
          <td align="right" valign="top" style="padding:16px 0;border-bottom:1px solid {LINE};font-family:{F};font-size:15px;font-weight:bold;color:{INK};white-space:nowrap;">{e(_inr(line_total))}</td>
        </tr>"""

    rows = "".join(item_row(i) for i in items)

    def cell(label: str, value: str, right: bool = False) -> str:
        pad = "padding-left:16px;border-left:1px solid " + LINE + ";" if right else ""
        return f"""<td valign="top" width="50%" style="font-family:{F};padding:14px 0;{pad}">
          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:{GREY};">{label}</div>
          <div style="font-size:15px;font-weight:bold;color:{INK};margin-top:4px;">{value}</div></td>"""

    address_block = (
        f"""<tr><td style="padding:24px 28px 0;font-family:{F};">
          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:{GREY};margin-bottom:8px;">Delivering to</div>
          <div style="font-size:14px;line-height:1.6;color:{INK};"><strong>{e(name)}</strong><br>{e(address)}{('<br>Mobile: ' + e(phone)) if phone else ''}</div>
        </td></tr>"""
        if address
        else ""
    )

    html_body = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>Order confirmed</title></head>
<body style="margin:0;padding:0;background:#F2F2F2;font-family:{F};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your order {e(order_number)} is confirmed. Estimated delivery: {e(eta)}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F2;padding:20px 10px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:6px;overflow:hidden;">

  <tr><td align="center" style="padding:22px 28px;border-bottom:3px solid {GOLD};">
    <img src="{e(_site())}/nirmal_gold_masale_logo.png" alt="Nirmal Gold Masale" width="130" style="display:block;border:0;max-width:130px;height:auto;">
  </td></tr>

  <tr><td align="center" style="padding:30px 28px 6px;font-family:{F};">
    <div style="width:52px;height:52px;line-height:52px;border-radius:26px;background:{GREEN};color:#FFFFFF;font-size:28px;font-weight:bold;text-align:center;margin:0 auto;">&#10003;</div>
    <h1 style="margin:16px 0 6px;font-size:22px;color:{INK};font-weight:bold;">Your order is confirmed!</h1>
    <p style="margin:0;font-size:14px;line-height:1.6;color:{GREY};">Hi {e(first)}, thanks for shopping with us. We&rsquo;re getting your spices ready to ship.</p>
  </td></tr>

  <tr><td style="padding:22px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid {LINE};border-bottom:1px solid {LINE};">
      <tr>{cell("Order ID", e(order_number))}{cell("Order date", e(placed_on), True)}</tr>
      <tr>{cell("Estimated delivery", e(eta))}{cell("Payment", e(payment_label), True)}</tr>
    </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 28px 4px;">
    <a href="{e(track_url)}" style="display:inline-block;padding:14px 38px;background:{INK};color:{GOLD_SOFT};text-decoration:none;border-radius:6px;font-family:{F};font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Track order</a>
  </td></tr>

  <tr><td style="padding:26px 28px 0;font-family:{F};">
    <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:{GREY};">Items in your order ({units})</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>
  </td></tr>

  <tr><td style="padding:18px 28px 0;font-family:{F};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:5px 0;font-size:14px;color:{GREY};">Item total</td>
          <td align="right" style="padding:5px 0;font-size:14px;color:{INK};">{e(_inr(subtotal))}</td></tr>
      <tr><td style="padding:5px 0;font-size:14px;color:{GREY};">Delivery</td>
          <td align="right" style="padding:5px 0;font-size:14px;color:{GREEN if shipping <= 0 else INK};">{e(shipping_text)}</td></tr>
      <tr><td style="padding:12px 0 0;border-top:1px solid {LINE};font-size:16px;font-weight:bold;color:{INK};">{e(amount_label)}</td>
          <td align="right" style="padding:12px 0 0;border-top:1px solid {LINE};font-size:18px;font-weight:bold;color:{INK};">{e(_inr(total))}</td></tr>
    </table>
  </td></tr>

  {address_block}

  <tr><td style="padding:28px 28px 30px;font-family:{F};">
    <div style="border-top:1px solid {LINE};padding-top:20px;font-size:13px;line-height:1.7;color:{GREY};">
      <strong style="color:{INK};">Need help with your order?</strong><br>
      Just reply to this email and we&rsquo;ll get back to you.<br>
      Button not working? Copy this link: <a href="{e(track_url)}" style="color:{GOLD};word-break:break-all;">{e(track_url)}</a>
    </div>
  </td></tr>

  <tr><td align="center" style="background:{INK};padding:18px 28px;font-family:{F};">
    <div style="font-size:11px;letter-spacing:3px;color:{GOLD_SOFT};">PURE SPICES &bull; ROYAL TASTE</div>
    <div style="font-size:11px;color:#B9A992;margin-top:6px;">&copy; Nirmal Gold Masale &middot; Dehradun, since 2001</div>
  </td></tr>

</table>
</td></tr></table>
</body></html>"""

    msg = EmailMessage()
    from_name = os.getenv("MAIL_FROM_NAME", "Nirmal Gold Masale")
    from_addr = os.getenv("MAIL_FROM_ADDRESS") or os.getenv("SMTP_USER") or "no-reply@localhost"
    msg["Subject"] = f"Your order is confirmed! Order {order_number} | Nirmal Gold Masale"
    msg["From"] = formataddr((from_name, from_addr))
    msg["To"] = order["email"].strip()
    reply_to = os.getenv("MAIL_REPLY_TO")
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    return msg


def _deliver(msg: EmailMessage) -> None:
    host = os.environ["SMTP_HOST"]
    security = os.getenv("SMTP_SECURITY", "starttls").lower()  # starttls | ssl | none
    port = int(os.getenv("SMTP_PORT") or (465 if security == "ssl" else 587))
    user, password = os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD")
    context = ssl.create_default_context()

    if security == "ssl":
        server: smtplib.SMTP = smtplib.SMTP_SSL(host, port, timeout=20, context=context)
    else:
        server = smtplib.SMTP(host, port, timeout=20)
    with server:
        if security == "starttls":
            server.starttls(context=context)
        if user and password:
            server.login(user, password)
        server.send_message(msg)


def send_order_confirmation(order: dict[str, Any]) -> bool:
    """Runs in a FastAPI background task. Never raises: a mail problem must not affect the order."""
    try:
        order = {**order, "items": _attach_images(order.get("items", []))}
        _deliver(build_message(order))
        log.info("Confirmation email sent for order %s", order.get("order_number"))
        return True
    except Exception:
        log.exception("Could not send confirmation email for order %s", order.get("order_number"))
        return False


# ----------------------------------------------------------------------------- newsletter welcome
def build_welcome_message(email: str) -> EmailMessage:
    """Short 'thanks for subscribing' email, in the same look as the order confirmation."""
    e = escape
    F = "Helvetica,Arial,sans-serif"
    GREY, LINE = "#6B6B6B", "#EAEAEA"
    shop_url = f"{_site()}/shop"

    text_body = "\n".join([
        "Hi there,",
        "",
        "Thank you for subscribing to Nirmal Gold Masale!",
        "",
        "You'll be the first to hear about new spice blends, seasonal combos and kitchen tips, straight from Dehradun.",
        "",
        f"Browse our spices: {shop_url}",
        "",
        "Don't want these emails? Just reply with the word UNSUBSCRIBE and we'll remove you.",
        "",
        "- Team Nirmal Gold Masale",
    ])

    html_body = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>Welcome to Nirmal Gold Masale</title></head>
<body style="margin:0;padding:0;background:#F2F2F2;font-family:{F};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks for subscribing. New blends, seasonal combos and kitchen tips are on their way.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F2;padding:20px 10px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:6px;overflow:hidden;">

  <tr><td align="center" style="padding:22px 28px;border-bottom:3px solid {GOLD};">
    <img src="{e(_site())}/nirmal_gold_masale_logo.png" alt="Nirmal Gold Masale" width="130" style="display:block;border:0;max-width:130px;height:auto;">
  </td></tr>

  <tr><td align="center" style="padding:34px 28px 10px;font-family:{F};">
    <h1 style="margin:0 0 10px;font-size:22px;color:{INK};font-weight:bold;">Welcome to the family!</h1>
    <p style="margin:0;font-size:14px;line-height:1.7;color:{GREY};">Thank you for subscribing. You&rsquo;ll be the first to hear about new spice blends, seasonal combos and kitchen tips, straight from Dehradun.</p>
  </td></tr>

  <tr><td align="center" style="padding:24px 28px 8px;">
    <a href="{e(shop_url)}" style="display:inline-block;padding:14px 38px;background:{INK};color:{GOLD_SOFT};text-decoration:none;border-radius:6px;font-family:{F};font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Browse our spices</a>
  </td></tr>

  <tr><td style="padding:26px 28px 30px;font-family:{F};">
    <div style="border-top:1px solid {LINE};padding-top:18px;font-size:12px;line-height:1.7;color:{GREY};">
      Don&rsquo;t want these emails? Just reply with the word <strong>UNSUBSCRIBE</strong> and we&rsquo;ll remove you.
    </div>
  </td></tr>

  <tr><td align="center" style="background:{INK};padding:18px 28px;font-family:{F};">
    <div style="font-size:11px;letter-spacing:3px;color:{GOLD_SOFT};">PURE SPICES &bull; ROYAL TASTE</div>
    <div style="font-size:11px;color:#B9A992;margin-top:6px;">&copy; Nirmal Gold Masale &middot; Dehradun, since 2001</div>
  </td></tr>

</table>
</td></tr></table>
</body></html>"""

    msg = EmailMessage()
    from_name = os.getenv("MAIL_FROM_NAME", "Nirmal Gold Masale")
    from_addr = os.getenv("MAIL_FROM_ADDRESS") or os.getenv("SMTP_USER") or "no-reply@localhost"
    msg["Subject"] = "Welcome to Nirmal Gold Masale"
    msg["From"] = formataddr((from_name, from_addr))
    msg["To"] = email.strip()
    reply_to = os.getenv("MAIL_REPLY_TO")
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    return msg


def send_newsletter_welcome(email: str) -> bool:
    """Runs in a FastAPI background task. Never raises: a mail problem must not break sign-up."""
    try:
        _deliver(build_welcome_message(email))
        log.info("Newsletter welcome email sent to %s", email)
        return True
    except Exception:
        log.exception("Could not send newsletter welcome email to %s", email)
        return False