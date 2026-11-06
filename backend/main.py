from __future__ import annotations

# `Optional[...]` is kept on purpose: Pydantic/FastAPI evaluate these annotations at runtime and
# `X | None` crashes on Python 3.9. Remove this line after upgrading to Python 3.10+.
# ruff: noqa: UP045
import os
import uuid
from datetime import datetime, timezone
from typing import Optional

import uvicorn
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

# Import our MongoDB collections!
from database import (
    get_orders_collection,
    get_products_collection,
    get_subscribers_collection,
)
from emailer import (
    email_configured,
    is_valid_email,
    send_newsletter_welcome,
    send_order_confirmation,
)
from payments import MAX_QTY_PER_LINE, price_cart
from payments import router as payments_router

app = FastAPI(
    title="Nirmal Masale API",
    description="Backend API with MongoDB for Nirmal Gold & Saviora Spices",
    version="1.0.0"
)

# CORS setup for Next.js frontend. Set FRONTEND_URL in backend/.env for production
# (e.g. https://www.nirmalgold.in) - it is added to the allowed origins.
# CORS_ORIGINS is an optional comma-separated list for extra origins, e.g. the non-www version of
# the site or a preview URL: CORS_ORIGINS=https://nirmalgold.in,https://my-preview.example.com
_origins = ["http://localhost:3000"]
if os.getenv("FRONTEND_URL"):
    _origins.append(os.getenv("FRONTEND_URL").rstrip("/"))
_origins += [o.strip().rstrip("/") for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments_router)

# --- GET ROUTES (CATALOG) ---

@app.get("/")
def read_root():
    return {"status": "online", "message": "API and MongoDB are running!"}

@app.get("/api/products")
def get_products():
    collection = get_products_collection()
    all_docs = list(collection.find({}))
    
    grouped = {}
    for doc in all_docs:
        name = doc["name"]
        # If the document is already in the new grouped format (has a 'sizes' list):
        if "sizes" in doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            grouped[name] = doc
        else:
            # Fallback for any old ungrouped documents:
            clean_slug = name.lower().replace(" ", "-")
            if name not in grouped:
                grouped[name] = {
                    "id": str(doc["_id"]),
                    "name": name,
                    "slug": clean_slug,
                    "category": doc.get("category", "Spices"),
                    "description": doc.get("description", ""),
                    "image_url": doc.get("image_url", ""),
                    "sizes": []
                }
            grouped[name]["sizes"].append({
                "weight": doc.get("weight", "Standard"),
                "price": doc.get("price", 0)
            })
            
    # Sort sizes by price for each product
    for name in grouped:
        grouped[name]["sizes"].sort(key=lambda x: x["price"])
        
    return {"status": "success", "data": list(grouped.values())}

@app.get("/api/products/{slug}")
def get_product_by_slug(slug: str):
    collection = get_products_collection()
    
    # Try finding an exact match by slug first
    product = collection.find_one({"slug": slug})
    
    # If not found directly, try matching via regex or fallback search
    if not product:
        all_docs = list(collection.find({}))
        for doc in all_docs:
            generated_slug = doc["name"].lower().replace(" ", "-")
            if generated_slug == slug or doc.get("slug") == slug:
                product = doc
                break
                
    if not product:
        return {"status": "error", "message": "Product not found"}
        
    # Ensure it has a structured sizes array if it's an older document structure
    if "sizes" not in product:
        name = product["name"]
        related_docs = list(collection.find({"name": name}))
        sizes = [{"weight": d.get("weight", "Standard"), "price": d.get("price", 0)} for d in related_docs]
        sizes.sort(key=lambda x: x["price"])
        product["sizes"] = sizes

    # Convert MongoDB '_id' to string 'id' for the frontend cart
    product["id"] = str(product["_id"])
    del product["_id"]
    
    return {"status": "success", "data": product}

# --- POST ROUTES (CHECKOUT) ---

class CartItemSchema(BaseModel):
    product_name: str
    weight: str
    quantity: int = Field(ge=1, le=MAX_QTY_PER_LINE)
    price: Optional[float] = None  # accepted for old clients, never used: prices come from the database

class CheckoutRequestSchema(BaseModel):
    first_name: str
    last_name: str
    address: str
    total_amount: Optional[float] = None  # ignored: the server works out the total itself
    items: list[CartItemSchema] = Field(min_length=1)
    # Optional extras - older clients that don't send them keep working.
    email: Optional[str] = None
    phone: Optional[str] = None
    payment_method: Optional[str] = None
    shipping_address: Optional[str] = None  # clean "street, city, state - pincode" for the email

@app.post("/api/checkout")
def create_order(request: CheckoutRequestSchema, background_tasks: BackgroundTasks):
    tracking_number = f"NRM-{str(uuid.uuid4().hex[:6]).upper()}"
    collection = get_orders_collection()

    # Price the order from MongoDB, exactly like online payments do. Never trust the browser's total.
    priced_items, _subtotal, _shipping, total_amount = price_cart(
        [(item.product_name, item.weight, item.quantity) for item in request.items]
    )

    # In MongoDB, we can beautifully embed the items directly inside the order document!
    order_document = {
        "order_number": tracking_number,
        "customer_first_name": request.first_name,
        "customer_last_name": request.last_name,
        "address": request.address,
        "total_amount": total_amount,
        "status": "Processing",
        "items": priced_items,
        "customer_email": (request.email or "").strip(),
        "customer_phone": request.phone,
        "payment_method": request.payment_method,
        "shipping_address": request.shipping_address,
        "payment_status": "cod" if request.payment_method == "cod" else "unpaid",
    }
    
    collection.insert_one(order_document)

    # Send the confirmation email AFTER the response, so checkout stays fast and a
    # mail problem can never make a paid/placed order look like it failed.
    email_queued = False
    if is_valid_email(request.email):
        if email_configured():
            background_tasks.add_task(
                send_order_confirmation,
                {
                    "order_number": tracking_number,
                    "first_name": request.first_name,
                    "last_name": request.last_name,
                    "email": request.email,
                    "phone": request.phone,
                    "items": priced_items,
                    "total_amount": total_amount,
                    "shipping_address": request.shipping_address or request.address,
                    "payment_method": request.payment_method,
                },
            )
            email_queued = True
        else:
            print("[email] SMTP_HOST is not set in backend/.env - skipping confirmation email.")

    return {
        "status": "success", 
        "message": "Order placed successfully!",
        "order_number": tracking_number,
        "total_amount": total_amount,
        "email_queued": email_queued,
    }

def _public_order(order: dict) -> dict:
    """Order tracking is open to anyone who knows an order number, so only return what the
    tracking page needs, with the customer's identity trimmed (no email, phone or full address)."""
    first = (order.get("customer_first_name") or "").strip()
    last = (order.get("customer_last_name") or "").strip()
    address = order.get("shipping_address") or order.get("address") or ""
    parts = [p.strip() for p in address.split(",") if p.strip()]
    return {
        "order_number": order.get("order_number"),
        "status": order.get("status"),
        "payment_status": order.get("payment_status"),
        "total_amount": order.get("total_amount"),
        "items": order.get("items", []),
        "customer_first_name": first,
        "customer_last_name": f"{last[0]}." if last else "",
        "address": ", ".join(parts[-2:]),  # e.g. "Dehradun, Uttarakhand - 248001"
    }


@app.get("/api/orders/{order_number}")
def get_order(order_number: str):
    collection = get_orders_collection()
    order = collection.find_one({"order_number": order_number.strip().upper()})

    if not order:
        return {"status": "error", "message": "Order not found"}

    return {"status": "success", "data": _public_order(order)}


# --- NEWSLETTER ---

class SubscribeSchema(BaseModel):
    email: str

@app.post("/api/newsletter/subscribe")
def subscribe_newsletter(request: SubscribeSchema, background_tasks: BackgroundTasks):
    email = request.email.strip().lower()
    if not is_valid_email(email):
        raise HTTPException(400, "Please enter a valid email address.")

    # One row per address. Only a NEW address gets the welcome mail, so pressing Subscribe
    # repeatedly (or typing someone else's address) can never be used to spam an inbox.
    try:
        result = get_subscribers_collection().update_one(
            {"email": email},
            {"$setOnInsert": {"email": email, "subscribed_at": datetime.now(timezone.utc), "source": "website"}},
            upsert=True,
        )
        is_new = result.upserted_id is not None
    except DuplicateKeyError:  # two identical requests raced each other
        is_new = False

    email_queued = False
    if is_new:
        if email_configured():
            background_tasks.add_task(send_newsletter_welcome, email)
            email_queued = True
        else:
            print("[email] SMTP_HOST is not set in backend/.env - skipping welcome email.")

    return {"status": "success", "already_subscribed": not is_new, "email_queued": email_queued}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)