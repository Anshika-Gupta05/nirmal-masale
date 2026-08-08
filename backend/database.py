from pymongo import MongoClient
import os
import urllib.parse
from dotenv import load_dotenv

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

def get_products_collection():
    return products_collection

def get_orders_collection():
    return orders_collection