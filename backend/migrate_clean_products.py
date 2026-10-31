"""
One-time migration: clean up duplicate product documents in MongoDB.

WHY:
  Some spices exist as more than one document because of small differences
  in how the name was typed during import — e.g.:
    "Nirmal Haldi Powder"       vs  "Nirmal Haldi Powder Rs 10"
    "Nirmal Dhaniya Powder"     vs  "Nirmal Dhania Powder Rs 10"
  Each becomes its own product card with only one size, instead of one card
  with all sizes. This script finds those groups, merges their `sizes`
  arrays into a single canonical document, and deletes the duplicates.

WHAT IT DOES NOT TOUCH:
  Products that are genuinely different items just get left alone — e.g.
  "Nirmal Sounf Sabut Moti" and "Nirmal Sounf Sabut Bareek" are different
  grinds of the same spice and are NOT merged, because their normalized
  names are different ("Moti" vs "Bareek" are real, distinguishing words,
  not price suffixes or typos).

HOW TO RUN:
  cd backend
  python migrate_clean_products.py            # dry run — prints a report, changes nothing
  python migrate_clean_products.py --apply     # actually merges & deletes in MongoDB

Always run the dry run first and read the report before using --apply.
"""

import re
import sys
from database import get_products_collection

# Known spelling variants -> canonical spelling.
# Add more pairs here if you spot other inconsistent spellings in your catalog.
SPELLING_ALIASES = {
    "dhania": "dhaniya",
    "chili": "chilli",
    "zeera": "jeera",
}


def normalize_name(raw_name: str) -> str:
    """Produces the name used to decide whether two documents are the same product."""
    name = raw_name.strip()

    # Strip a trailing price annotation like "Rs 10", "Rs. 10", "₹10", "- 10/-"
    name = re.sub(r"\s*[-–]?\s*(rs\.?|₹)\s*\d+\s*/?-?\s*$", "", name, flags=re.IGNORECASE).strip()

    # Collapse repeated whitespace
    name = re.sub(r"\s+", " ", name)

    # Apply known spelling aliases word-by-word, preserving capitalization style
    fixed_words = []
    for word in name.split(" "):
        key = word.lower()
        if key in SPELLING_ALIASES:
            canonical = SPELLING_ALIASES[key]
            fixed_words.append(canonical.capitalize() if word[:1].isupper() else canonical)
        else:
            fixed_words.append(word)

    return " ".join(fixed_words).strip()


def slugify(name: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower())).strip("-")


def main():
    apply_changes = "--apply" in sys.argv
    collection = get_products_collection()
    all_docs = list(collection.find({}))

    groups = {}  # normalized_name -> list of raw docs
    for doc in all_docs:
        key = normalize_name(doc["name"]).lower()
        groups.setdefault(key, []).append(doc)

    duplicate_groups = {k: v for k, v in groups.items() if len(v) > 1}

    if not duplicate_groups:
        print("No duplicate products found. Nothing to do.")
        return

    print(f"Found {len(duplicate_groups)} product(s) with duplicate documents:\n")

    for key, docs in duplicate_groups.items():
        canonical_name = normalize_name(docs[0]["name"])
        print(f'  "{canonical_name}"  <-  merges {len(docs)} documents:')
        for d in docs:
            sizes_preview = d.get("sizes") or [{"weight": d.get("weight", "Standard"), "price": d.get("price", 0)}]
            print(f'      - "{d["name"]}"  (id: {d["_id"]})  sizes: {sizes_preview}')

        # Merge sizes from all docs in the group, de-duplicating by weight
        merged_sizes = []
        seen_weights = set()
        best_image = ""
        best_description = ""
        best_category = docs[0].get("category", "Spices")

        for d in docs:
            doc_sizes = d.get("sizes") or [{"weight": d.get("weight", "Standard"), "price": d.get("price", 0)}]
            for s in doc_sizes:
                if s["weight"] not in seen_weights:
                    seen_weights.add(s["weight"])
                    merged_sizes.append({"weight": s["weight"], "price": s.get("price", 0)})
            if not best_image and d.get("image_url"):
                best_image = d["image_url"]
            if not best_description and d.get("description"):
                best_description = d["description"]

        merged_sizes.sort(key=lambda s: s["price"])

        print(f'      -> merged sizes: {merged_sizes}\n')

        if apply_changes:
            # Keep the first document as the canonical one, update it in place
            keep_doc = docs[0]
            collection.update_one(
                {"_id": keep_doc["_id"]},
                {"$set": {
                    "name": canonical_name,
                    "slug": slugify(canonical_name),
                    "category": best_category,
                    "description": best_description or keep_doc.get("description", ""),
                    "image_url": best_image or keep_doc.get("image_url", ""),
                    "sizes": merged_sizes,
                }}
            )
            # Delete the rest
            for d in docs[1:]:
                collection.delete_one({"_id": d["_id"]})

    if apply_changes:
        print(f"Done. Merged {len(duplicate_groups)} product group(s) in MongoDB.")
    else:
        print("This was a DRY RUN — no changes were made.")
        print("Review the merges above, then run again with --apply to make them permanent:")
        print("    python migrate_clean_products.py --apply")


if __name__ == "__main__":
    main()