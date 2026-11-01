"""Razorpay online payments (UPI / cards / netbanking / wallets).

Flow
----
1. POST /api/payments/create-order  -> we re-price the cart from the DB (never trust the browser),
   save the order as "Awaiting Payment", create a Razorpay order and return what Checkout.js needs.
2. Browser opens the Razorpay popup; the customer pays.
3. POST /api/payments/verify        -> we check Razorpay's HMAC signature, mark the order paid and
   send the confirmation email.
4. POST /api/payments/webhook       -> Razorpay calls us server-to-server. This is the safety net for
   customers who pay and then close the tab before step 3 runs. Marking paid is idempotent, so
   verify + webhook can both fire safely.

Configure in backend/.env (see .env.example):
    RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
"""
from __future__ import annotations

# `Optional[...]` is kept on purpose: Pydantic/FastAPI evaluate these annotations at runtime and
# `X | None` crashes on Python 3.9. Remove this line after upgrading to Python 3.10+.
# ruff: noqa: UP045
import hashlib
import hmac
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

import requests
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from pydantic import BaseModel, Field

from database import get_orders_collection, get_products_collection
from emailer import email_configured, is_valid_email, send_order_confirmation

log = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/api/payments", tags=["payments"])

RAZORPAY_API = "https://api.razorpay.com/v1"

# Keep in sync with frontend/app/checkout/page.tsx
FREE_SHIPPING_ABOVE = 300
SHIPPING_FEE = 50
MAX_QTY_PER_LINE = 50


# ----------------------------------------------------------------------------- helpers
def _key_id() -> str:
    return os.getenv("RAZORPAY_KEY_ID", "")


def _key_secret() -> str:
    return os.getenv("RAZORPAY_KEY_SECRET", "")


def razorpay_configured() -> bool:
    return bool(_key_id() and _key_secret())


def _unit_price(name: str, weight: str) -> Optional[float]:
    """Authoritative price for a product + pack size, straight from MongoDB.

    Handles both the grouped format ({name, sizes: [{weight, price}]}) and the older
    one-document-per-size format that /api/products also supports.
    """
    for doc in get_products_collection().find({"name": name}):
        if "sizes" in doc:
            for size in doc["sizes"]:
                if size.get("weight") == weight:
                    return float(size["price"])
        elif doc.get("weight") == weight:
            return float(doc.get("price", 0))
    return None


def _constant_time_eq(a: str, b: str) -> bool:
    return hmac.compare_digest(a.encode(), b.encode())


def _sign(secret: str, message: bytes) -> str:
    return hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()


def _mark_paid(razorpay_order_id: str, razorpay_payment_id: str) -> Optional[dict[str, Any]]:
    """Flip an order to paid. Returns the order ONLY on the call that actually made the change,
    so the email is sent exactly once even when verify and the webhook both arrive."""
    return get_orders_collection().find_one_and_update(
        {"razorpay_order_id": razorpay_order_id, "payment_status": {"$ne": "paid"}},
        {
            "$set": {
                "payment_status": "paid",
                "status": "Processing",
                "razorpay_payment_id": razorpay_payment_id,
                "paid_at": datetime.now(timezone.utc),
            }
        },
    )


def _queue_confirmation_email(order: dict[str, Any], background_tasks: BackgroundTasks) -> bool:
    email = order.get("customer_email")
    if not (is_valid_email(email) and email_configured()):
        return False
    background_tasks.add_task(
        send_order_confirmation,
        {
            "order_number": order["order_number"],
            "first_name": order.get("customer_first_name", ""),
            "last_name": order.get("customer_last_name", ""),
            "email": email,
            "phone": order.get("customer_phone"),
            "items": order.get("items", []),
            "total_amount": order["total_amount"],
            "shipping_address": order.get("shipping_address") or order.get("address"),
            "payment_method": "online",
        },
    )
    return True


# ----------------------------------------------------------------------------- schemas
class PayItem(BaseModel):
    product_name: str
    weight: str
    quantity: int = Field(ge=1, le=MAX_QTY_PER_LINE)
    # Accepted so the existing cart payload can be posted as-is, but NEVER used for pricing.
    price: Optional[float] = None


class CreatePaymentOrder(BaseModel):
    first_name: str
    last_name: str
    address: str
    email: str
    phone: str
    shipping_address: Optional[str] = None
    items: list[PayItem] = Field(min_length=1)


class VerifyPayment(BaseModel):
    order_number: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ----------------------------------------------------------------------------- routes
@router.post("/create-order")
def create_payment_order(req: CreatePaymentOrder):
    if not razorpay_configured():
        raise HTTPException(503, "Online payments are not available right now. Please choose Cash on Delivery.")
    if not is_valid_email(req.email):
        raise HTTPException(400, "Please enter a valid email address.")

    # Re-price every line from the database.
    priced_items: list[dict[str, Any]] = []
    subtotal = 0.0
    for item in req.items:
        price = _unit_price(item.product_name, item.weight)
        if price is None:
            raise HTTPException(
                400, f"'{item.product_name} ({item.weight})' is no longer available. Please refresh your cart."
            )
        subtotal += price * item.quantity
        priced_items.append(
            {"product_name": item.product_name, "weight": item.weight, "quantity": item.quantity, "price": price}
        )

    shipping = 0 if subtotal > FREE_SHIPPING_ABOVE else SHIPPING_FEE
    total = round(subtotal + shipping, 2)
    amount_paise = round(total * 100)

    order_number = f"NRM-{uuid.uuid4().hex[:6].upper()}"

    try:
        resp = requests.post(
            f"{RAZORPAY_API}/orders",
            auth=(_key_id(), _key_secret()),
            json={
                "amount": amount_paise,
                "currency": "INR",
                "receipt": order_number,
                "notes": {"order_number": order_number},
            },
            timeout=15,
        )
        resp.raise_for_status()
        rzp_order = resp.json()
    except requests.RequestException:
        log.exception("Razorpay order creation failed for %s", order_number)
        raise HTTPException(502, "Could not start the payment. Please try again in a moment.")

    get_orders_collection().insert_one(
        {
            "order_number": order_number,
            "customer_first_name": req.first_name,
            "customer_last_name": req.last_name,
            "address": req.address,
            "shipping_address": req.shipping_address,
            "total_amount": total,
            "status": "Awaiting Payment",
            "items": priced_items,
            "customer_email": req.email.strip(),
            "customer_phone": req.phone,
            "payment_method": "online",
            "payment_status": "pending",
            "razorpay_order_id": rzp_order["id"],
            "amount_paise": amount_paise,
            "created_at": datetime.now(timezone.utc),
        }
    )

    return {
        "status": "success",
        "order_number": order_number,
        "razorpay_order_id": rzp_order["id"],
        "key_id": _key_id(),  # the public key id is meant to be sent to the browser
        "amount": amount_paise,
        "currency": "INR",
        "total_amount": total,
    }


@router.post("/verify")
def verify_payment(req: VerifyPayment, background_tasks: BackgroundTasks):
    if not razorpay_configured():
        raise HTTPException(503, "Online payments are not configured.")

    order = get_orders_collection().find_one({"order_number": req.order_number.strip().upper()})
    if not order or order.get("razorpay_order_id") != req.razorpay_order_id:
        raise HTTPException(404, "Order not found.")

    expected = _sign(_key_secret(), f"{req.razorpay_order_id}|{req.razorpay_payment_id}".encode())
    if not _constant_time_eq(expected, req.razorpay_signature):
        log.warning("Bad payment signature for order %s", order["order_number"])
        raise HTTPException(400, "Payment verification failed.")

    changed = _mark_paid(req.razorpay_order_id, req.razorpay_payment_id)
    email_queued = _queue_confirmation_email(changed, background_tasks) if changed else False

    return {
        "status": "success",
        "message": "Payment received. Order confirmed!",
        "order_number": order["order_number"],
        "email_queued": email_queued,
    }


@router.post("/webhook")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks):
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    if not secret:
        raise HTTPException(503, "Webhook secret not configured.")

    raw = await request.body()  # signature is over the exact raw bytes
    signature = request.headers.get("X-Razorpay-Signature", "")
    if not _constant_time_eq(_sign(secret, raw), signature):
        raise HTTPException(400, "Invalid signature.")

    event = json.loads(raw)
    name = event.get("event")
    entity = event.get("payload", {}).get("payment", {}).get("entity", {})
    rzp_order_id, rzp_payment_id = entity.get("order_id"), entity.get("id")

    if name in ("payment.captured", "order.paid") and rzp_order_id and rzp_payment_id:
        order = _mark_paid(rzp_order_id, rzp_payment_id)
        if order:
            _queue_confirmation_email(order, background_tasks)
            log.info("Webhook marked %s as paid", order["order_number"])
    elif name == "payment.failed" and rzp_order_id:
        # Never downgrade an order that has since been paid (customers can retry in the same popup).
        get_orders_collection().update_one(
            {"razorpay_order_id": rzp_order_id, "payment_status": "pending"},
            {"$set": {"payment_status": "failed"}},
        )

    # Always 200 for events we don't care about, otherwise Razorpay keeps retrying.
    return {"status": "ok"}