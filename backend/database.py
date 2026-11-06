import os
import urllib.parse

from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from the .env file
load_dotenv()

# Safely fetch and URL-encode the credentials
username = urllib.parse.quote_plus(os.getenv("MONGO_USER", ""))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS", ""))
cluster = os.getenv("MONGO_CLUSTER", "")

# Construct the safe URI dynamically
MONGO_URI = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority"

# Initialize the MongoDB client
client = MongoClient(MONGO_URI)

# Create or connect to a specific database for your store
db = client["nirmal_masale_db"]

# Define our two main collections
products_collection = db["products"]
orders_collection = db["orders"]
subscribers_collection = db["subscribers"]

def get_products_collection():
    return products_collection

def get_orders_collection():
    return orders_collection

_subscribers_indexed = False

def get_subscribers_collection():
    """Newsletter sign-ups. A unique index on `email` guarantees one row per address."""
    global _subscribers_indexed
    if not _subscribers_indexed:
        subscribers_collection.create_index("email", unique=True)
        _subscribers_indexed = True
    return subscribers_collection