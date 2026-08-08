import os
import urllib.parse
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

username = urllib.parse.quote_plus(os.getenv("MONGO_USER", ""))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS", ""))
cluster = os.getenv("MONGO_CLUSTER", "")

MONGO_URI = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["nirmal_masale_db"]
collection = db["products"]

print("Fetching current products...")
all_docs = list(collection.find({}))
grouped_products = {}

for doc in all_docs:
    name = doc["name"]
    # Create the clean, perfect slug (e.g., "Nirmal Haldi Powder" -> "nirmal-haldi-powder")
    clean_slug = name.lower().replace(" ", "-")
    
    if name not in grouped_products:
        grouped_products[name] = {
            "name": name,
            "slug": clean_slug,
            "category": doc["category"],
            "description": doc["description"],
            "image_url": doc["image_url"],
            "sizes": [] # We will store the weights and prices here!
        }
    
    # Add this specific size to the product's size array
    grouped_products[name]["sizes"].append({
        "weight": doc["weight"],
        "price": doc["price"]
    })

# Sort sizes by price (lowest to highest) for each product
for name in grouped_products:
    grouped_products[name]["sizes"].sort(key=lambda x: x["price"])

print("Clearing old messy database...")
collection.delete_many({})

print("Inserting clean, grouped products...")
final_products = list(grouped_products.values())
collection.insert_many(final_products)

print(f"✅ Success! Condensed into {len(final_products)} perfectly grouped products.")