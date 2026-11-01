"""Order-confirmation emails, sent over plain SMTP (standard library only - no new packages).

Configure in backend/.env (see .env.example). If SMTP_HOST is not set, emails are simply
skipped and orders still work, so local development needs no mail setup.
"""
import logging
import os
import re
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from html import escape
from typing import Any, Dict, List, Optional
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


def is_valid_email(value: Optional[str]) -> bool:
    return bool(value) and len(value.strip()) <= 254 and bool(_EMAIL_RE.match(value.strip()))


def email_configured() -> bool:
    return bool(os.getenv("SMTP_HOST"))


def _inr(amount: float) -> str:
    amount = float(amount)
    return f"₹{int(amount):,}" if amount.is_integer() else f"₹{amount:,.2f}"


def _track_url(order_number: str) -> str:
    base = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    return f"{base}/track-order?order={quote(order_number)}"


def build_message(order: Dict[str, Any]) -> EmailMessage:
    """`order` keys: order_number, first_name, last_name, email, items, total_amount,
    shipping_address, payment_method."""
    order_number: str = order["order_number"]
    items: List[Dict[str, Any]] = order.get("items", [])
    total = float(order["total_amount"])
    subtotal = sum(float(i["price"]) * int(i["quantity"]) for i in items)
    shipping = round(total - subtotal, 2)
    name = f'{order.get("first_name", "")} {order.get("last_name", "")}'.strip() or "there"
    first = (order.get("first_name") or "").strip() or "there"
    address = order.get("shipping_address") or ""
    payment = PAYMENT_LABELS.get(order.get("payment_method") or "", "")
    track_url = _track_url(order_number)
    shipping_text = "FREE" if shipping <= 0 else _inr(shipping)

    # ---------------- plain-text version ----------------
    lines = [
        f"Hi {first},",
        "",
        "Thank you for shopping with Nirmal Gold Masale! Your order is confirmed.",
        "",
        f"Tracking number: {order_number}",
        f"Track your order: {track_url}",
        "",
        "ORDER SUMMARY",
    ]
    for i in items:
        lines.append(f'- {i["product_name"]} ({i["weight"]}) x {i["quantity"]}: {_inr(float(i["price"]) * int(i["quantity"]))}')
    lines += ["", f"Subtotal: {_inr(subtotal)}", f"Shipping: {shipping_text}", f"Total: {_inr(total)}"]
    if payment:
        lines.append(f"Payment: {payment}")
    if address:
        lines += ["", "DELIVERING TO", name, address]
    lines += ["", "Questions? Just reply to this email.", "", "- Team Nirmal Gold Masale"]
    text_body = "\n".join(lines)

    # ---------------- HTML version (inline styles + tables for email clients) ----------------
    e = escape  # every customer-supplied value goes through this
    rows = "".join(
        f"""<tr>
          <td style="padding:12px 0;border-bottom:1px solid #E9DFC9;font-size:14px;color:{INK};">
            <strong>{e(str(i["product_name"]))}</strong><br>
            <span style="font-size:12px;color:#7A6A55;">{e(str(i["weight"]))} &nbsp;•&nbsp; Qty {e(str(i["quantity"]))}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #E9DFC9;font-size:14px;color:{INK};white-space:nowrap;">
            {e(_inr(float(i["price"]) * int(i["quantity"])))}
          </td></tr>"""
        for i in items
    )
    address_block = (
        f"""<tr><td style="padding:24px 32px 0;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:{GOLD};font-weight:bold;">Delivering to</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:{INK};"><strong>{e(name)}</strong><br>{e(address)}</p>
        </td></tr>"""
        if address
        else ""
    )
    payment_row = (
        f"""<tr><td style="padding:6px 0;font-size:14px;color:#7A6A55;">Payment</td>
            <td align="right" style="padding:6px 0;font-size:14px;color:{INK};">{e(payment)}</td></tr>"""
        if payment
        else ""
    )

    html_body = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order confirmed</title></head>
<body style="margin:0;padding:0;background:{IVORY};font-family:Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your order {e(order_number)} is confirmed. Track it anytime with this number.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{IVORY};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:{CREAM};border-radius:14px;overflow:hidden;">

  <tr><td align="center" style="background:{INK};padding:28px 32px;">
    <img src="{e(os.getenv('FRONTEND_URL', 'http://localhost:3000').rstrip('/'))}/nirmal_gold_masale_logo.png" alt="Nirmal Gold Masale" width="160" style="display:block;border:0;outline:none;text-decoration:none;max-width:160px;height:auto;">
    <div style="font-size:11px;letter-spacing:4px;color:{IVORY};margin-top:8px;">PURE SPICES &bull; ROYAL TASTE</div>
  </td></tr>

  <tr><td style="padding:32px 32px 0;">
    <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:{INK};">Thank you, {e(first)}!</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#4A3C2E;">Your order is confirmed and your spices are being prepared with care.</p>
  </td></tr>

  <tr><td style="padding:24px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid {GOLD};border-radius:12px;background:#FFFFFF;">
      <tr><td align="center" style="padding:20px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A6A55;">Your tracking number</p>
        <p style="margin:0;font-family:'Courier New',monospace;font-size:28px;font-weight:bold;letter-spacing:2px;color:{INK};">{e(order_number)}</p>
        <a href="{e(track_url)}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:{INK};color:{GOLD_SOFT};text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Track your order</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:28px 32px 0;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:{GOLD};font-weight:bold;">Order summary</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#7A6A55;">Subtotal</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:{INK};">{e(_inr(subtotal))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#7A6A55;">Shipping</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:{INK};">{e(shipping_text)}</td></tr>
      {payment_row}
      <tr><td style="padding:12px 0 0;border-top:2px solid {INK};font-family:Georgia,'Times New Roman',serif;font-size:18px;color:{INK};">Total</td>
          <td align="right" style="padding:12px 0 0;border-top:2px solid {INK};font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;color:{INK};">{e(_inr(total))}</td></tr>
    </table>
  </td></tr>

  {address_block}

  <tr><td style="padding:28px 32px 32px;">
    <p style="margin:0;font-size:13px;line-height:1.6;color:#7A6A55;">Questions about your order? Just reply to this email and we&rsquo;ll help.<br>
    Button not working? Copy this link: <a href="{e(track_url)}" style="color:{GOLD};">{e(track_url)}</a></p>
  </td></tr>

</table>
<p style="font-size:11px;color:#7A6A55;margin:16px 0 0;">&copy; Nirmal Gold Masale</p>
</td></tr></table>
</body></html>"""

    msg = EmailMessage()
    from_name = os.getenv("MAIL_FROM_NAME", "Nirmal Gold Masale")
    from_addr = os.getenv("MAIL_FROM_ADDRESS") or os.getenv("SMTP_USER") or "no-reply@localhost"
    msg["Subject"] = f"Order confirmed - {order_number} | Nirmal Gold Masale"
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


def send_order_confirmation(order: Dict[str, Any]) -> bool:
    """Runs in a FastAPI background task. Never raises: a mail problem must not affect the order."""
    try:
        _deliver(build_message(order))
        log.info("Confirmation email sent for order %s", order.get("order_number"))
        return True
    except Exception:
        log.exception("Could not send confirmation email for order %s", order.get("order_number"))
        return False