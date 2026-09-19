from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import uuid

# Import our MongoDB collections!
from database import get_products_collection, get_orders_collection

app = FastAPI(
    title="Nirmal Masale API",
    description="Backend API with MongoDB for Nirmal Gold & Saviora Spices",
    version="1.0.0"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.14:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    quantity: int
    price: float

class CheckoutRequestSchema(BaseModel):
    first_name: str
    last_name: str
    address: str
    total_amount: float
    items: List[CartItemSchema]

@app.post("/api/checkout")
def create_order(request: CheckoutRequestSchema):
    tracking_number = f"NRM-{str(uuid.uuid4().hex[:6]).upper()}"
    collection = get_orders_collection()

    # In MongoDB, we can beautifully embed the items directly inside the order document!
    order_document = {
        "order_number": tracking_number,
        "customer_first_name": request.first_name,
        "customer_last_name": request.last_name,
        "address": request.address,
        "total_amount": request.total_amount,
        "status": "Processing",
        "items": [item.dict() for item in request.items] 
    }
    
    collection.insert_one(order_document)

    return {
        "status": "success", 
        "message": "Order placed successfully!",
        "order_number": tracking_number
    }

@app.get("/api/orders/{order_number}")
def get_order(order_number: str):
    collection = get_orders_collection()
    order = collection.find_one({"order_number": order_number.strip().upper()})

    if not order:
        return {"status": "error", "message": "Order not found"}

    order["id"] = str(order["_id"])
    del order["_id"]

    return {"status": "success", "data": order}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)