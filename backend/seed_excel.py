import os
import re
import urllib.parse
import pandas as pd
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
products_collection = db["products"]

# Known spelling variants -> canonical spelling, so the same spice always
# ends up under one name regardless of how a row was typed in the sheet.
# (Keep this in sync with backend/migrate_clean_products.py.)
SPELLING_ALIASES = {
    "dhania": "dhaniya",
    "chili": "chilli",
    "zeera": "jeera",
}


def normalize_item_name(raw_name: str) -> str:
    """Cleans a raw ITEM cell so the same spice never ends up as two
    different product names (e.g. a stray trailing price, or a spelling
    variant like 'Dhania' vs 'Dhaniya')."""
    name = raw_name.strip()
    # Strip a trailing price annotation like "Rs 10", "Rs. 10", "₹10"
    name = re.sub(r"\s*[-–]?\s*(rs\.?|₹)\s*\d+\s*/?-?\s*$", "", name, flags=re.IGNORECASE).strip()
    name = re.sub(r"\s+", " ", name)
    fixed_words = []
    for word in name.split(" "):
        key = word.lower()
        if key in SPELLING_ALIASES:
            canonical = SPELLING_ALIASES[key]
            fixed_words.append(canonical.capitalize() if word[:1].isupper() else canonical)
        else:
            fixed_words.append(word)
    return " ".join(fixed_words).strip()

# 📸 The exact list of images currently in your products folder
IMAGE_FILES = [
    "nirmal-gold-ajwain-pouch.png", "nirmal-gold-amchur-powder-natural-box.png",
    "nirmal-gold-amchur-powder-pouch.png", "nirmal-gold-besan-pouch.png",
    "nirmal-gold-biryani-masala-box.png", "nirmal-gold-black-pepper-powder-natural-box.png",
    "nirmal-gold-black-salt-pouch.png", "nirmal-gold-chana-masala-box.png",
    "nirmal-gold-chat-masala-box.png", "nirmal-gold-chat-masala.png",
    "nirmal-gold-chicken-masala-box.png", "nirmal-gold-chicken-masala-natural-box.png",
    "nirmal-gold-chole-masala.png", "nirmal-gold-coriander-powder-pouch.png",
    "nirmal-gold-dry-ginger-powder-natural-box.png", "nirmal-gold-elaichi-powder-box.png",
    "nirmal-gold-fish-masala-box.png", "nirmal-gold-garam-masala-box.png",
    "nirmal-gold-garam-masala-pouch.png", "nirmal-gold-haldi-powder-pouch.png",
    "nirmal-gold-jaljeera-masala-box.png", "nirmal-gold-jeera-pouch.png",
    "nirmal-gold-jeera-powder-box.png", "nirmal-gold-jeera-powder-natural-box.png",
    "nirmal-gold-kashmiri-mirch-box.png", "nirmal-gold-kashmiri-mirch-powder-box.png",
    "nirmal-gold-kasuri-methi-box.png", "nirmal-gold-kasuri-methi-pouch.png",
    "nirmal-gold-kitchen-king.png", "nirmal-gold-meat-masala-box.png",
    "nirmal-gold-meat-masala-natural-box.png", "nirmal-gold-methi-dana-pouch.png",
    "nirmal-gold-mirch-kutti-pouch.png", "nirmal-gold-mirch-kutti-special-pouch.png",
    "nirmal-gold-mirch-powder-special-pouch.png", "nirmal-gold-monosodium-glutamate-pouch.png",
    "nirmal-gold-poha-pouch.png", "nirmal-gold-raita-masala-box.png",
    "nirmal-gold-red-chilli-powder-pouch.png", "nirmal-gold-rock-salt-pouch.png",
    "nirmal-gold-sabji-masala-box.png", "nirmal-gold-saunf-bareek-pouch.png",
    "nirmal-gold-saunf-moti-pouch.png", "nirmal-gold-saunf-powder-natural-box.png",
    "nirmal-gold-shahi-paneer-masala-box.png", "nirmal-gold-white-pepper-powder.png",
    "nirmal-gold-yellow-mustard-pouch.png"
]

def categorize_product(name: str) -> str:
    name_lower = name.lower()
    
    # 1. Blended Spices (Masalas & Mixes)
    blended_keywords = ['masala', 'biryani', 'chicken', 'meat', 'fish', 'chole', 'shahi-paneer', 'kitchen-king', 'jaljeera', 'raita', 'chat', 'chana', 'sabji']
    if any(keyword in name_lower for keyword in blended_keywords):
        return "Blended Spices"
        
    # 2. Whole Spices & Seeds
    whole_keywords = ['jeera', 'ajwain', 'methi-dana', 'saunf', 'mustard', 'kasuri-methi', 'black-pepper']
    if any(keyword in name_lower for keyword in whole_keywords) and 'powder' not in name_lower:
        return "Whole Spices & Seeds"
        
    # 3. Ground Spices (Powders)
    powder_keywords = ['powder', 'haldi', 'mirch', 'coriander', 'elaichi', 'dry-ginger']
    if any(keyword in name_lower for keyword in powder_keywords):
        return "Ground Spices"
        
    # 4. Specialty / Essentials (Salt, Besan, Poha, MSG)
    return "Specialty Essentials"

def get_image_for_item(item_name, size):
    search_name = item_name.lower().replace(' ', '-')
    size_str = str(size).lower()
    
    if 'dhaniya' in search_name or 'dhania' in search_name:
        search_name = 'coriander'
    if 'mirch-powder' in search_name and 'kashmiri' not in search_name and 'special' not in search_name:
        search_name = 'red-chilli'
    if 'sendha' in search_name or 'pink-salt' in search_name:
        search_name = 'rock-salt'
    if 'kali-mirch' in search_name:
        search_name = 'black-pepper'
    if 'sounth' in search_name:
        search_name = 'dry-ginger'
    if 'sounf' in search_name:
        search_name = 'saunf'
        
    if 'amchoor' in search_name:
        search_name = 'amchur'
    if 'jal-jeera' in search_name:
        search_name = 'jaljeera'
    if 'kitchen-king' in search_name:
        search_name = 'kitchen-king'
    if 'subji' in search_name:
        search_name = 'sabji'
    if 'haldi' in search_name:
        search_name = 'haldi'
    if 'jeera-sabut' in search_name:
        search_name = 'jeera-pouch'
    if 'ajwain' in search_name:
        search_name = 'ajwain'
    if 'pili-sarso' in search_name:
        search_name = 'yellow-mustard'
    if 'ajinomoto' in search_name:
        search_name = 'monosodium-glutamate'
        
    best_match = "/next.svg"
    possible_matches = [img for img in IMAGE_FILES if search_name in img]

    if possible_matches:
        if 'box' in size_str or '12gm' in size_str or '10gm' in size_str or '6gm' in size_str:
            for img in possible_matches:
                if 'box' in img:
                    return f"/products/{img}"
        
        for img in possible_matches:
            if 'pouch' in img:
                return f"/products/{img}"
                
        best_match = f"/products/{possible_matches[0]}"
        
    return best_match

def extract_sheet_data(xls, sheet_name, skiprows, col_names, item_col, size_col, price_col):
    df = pd.read_excel(xls, sheet_name, skiprows=skiprows)
    df = df.iloc[:, :len(col_names)]
    df.columns = col_names
    df[item_col] = df[item_col].ffill()
    df = df.dropna(subset=[size_col, price_col])
    
    products = []
    for _, row in df.iterrows():
        try:
            name = normalize_item_name(str(row[item_col]).title().strip())
            size = str(row[size_col]).strip()
            price = float(row[price_col])
            slug = f"nirmal-{name.lower().replace(' ', '-')}-{size.lower().replace(' ', '')}"
            
            # Use our intelligent auto-categorization function!
            category = categorize_product(name)
            
            matched_image = get_image_for_item(name, size)

            products.append({
                "name": f"Nirmal {name}",
                "category": category,
                "slug": slug,
                "weight": size,
                "price": price,
                "description": f"Authentic {name} processed and packed hygienically.",
                "image_url": matched_image
            })
        except Exception as e:
            continue
    return products

def seed_database():
    products_collection.delete_many({})
    print("Cleared existing MongoDB catalog...")

    print("Reading MEDITEDRATELIST.xlsx...")
    xls = pd.ExcelFile('MEDITEDRATELIST.xlsx')
    flat_rows = []

    flat_rows.extend(extract_sheet_data(xls, 'Table 1', 2, ['SN', 'ITEM', 'SIZE', 'CASE', 'MRP', 'RET', 'TAR', 'SCH'], 'ITEM', 'SIZE', 'MRP'))
    flat_rows.extend(extract_sheet_data(xls, 'Table 2', 1, ['SN', 'ITEM', 'SIZE', 'CASE', 'MRP', 'RET', 'TAR', 'SCH'], 'ITEM', 'SIZE', 'MRP'))
    flat_rows.extend(extract_sheet_data(xls, 'Table 3', 0, ['SN', 'ITEM', 'SIZE', 'CASE', 'MRP', 'RET', 'TAR', 'SCH'], 'ITEM', 'SIZE', 'MRP'))
    flat_rows.extend(extract_sheet_data(xls, 'Table 4', 1, ['SN', 'ITEM', 'SIZE', 'CASE', 'MRP', 'RET', 'TAR'], 'ITEM', 'SIZE', 'MRP'))
    flat_rows.extend(extract_sheet_data(xls, 'Table 5', 1, ['SN', 'ITEM', 'SIZE', 'CASE', 'MRP', 'RET'], 'ITEM', 'SIZE', 'MRP'))

    # Group the flat (one row = one size) rows into one document per product,
    # each holding a `sizes` array — this matches the live schema and is what
    # keeps every pack size of the same spice on a single product card.
    grouped = {}
    for row in flat_rows:
        key = row["name"].lower()
        if key not in grouped:
            grouped[key] = {
                "name": row["name"],
                "category": row["category"],
                "slug": row["slug"].rsplit("-", 1)[0] if "-" in row["slug"] else row["slug"],
                "description": row["description"],
                "image_url": row["image_url"],
                "sizes": [],
            }
        existing_weights = {s["weight"] for s in grouped[key]["sizes"]}
        if row["weight"] not in existing_weights:
            grouped[key]["sizes"].append({"weight": row["weight"], "price": row["price"]})
        if not grouped[key]["image_url"] and row["image_url"]:
            grouped[key]["image_url"] = row["image_url"]

    for product in grouped.values():
        product["sizes"].sort(key=lambda s: s["price"])

    all_products = list(grouped.values())

    if all_products:
        result = products_collection.insert_many(all_products)
        print(f"✅ Successfully seeded {len(result.inserted_ids)} products (grouped by name, with intelligent categories)!")
    else:
        print("No products found to insert.")

if __name__ == "__main__":
    seed_database()