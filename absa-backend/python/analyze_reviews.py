import pymongo
from config import MONGO_URI, DB_NAME, COLLECTION_NAME
from utils import analyze_sentiment
from scrape_reviews import scrape_flipkart_reviews

# Example Flipkart URL (replace with real one)
URL = "https://www.flipkart.com/product-reviews/XXXXXXXX"

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Scrape reviews
reviews = scrape_flipkart_reviews(URL)

# Analyze and store in MongoDB
for r in reviews:
    r["sentiment"] = analyze_sentiment(r["comment"])
    r["date"] = None  # Optionally, extract review date
    collection.insert_one(r)

print("Reviews scraped, analyzed, and stored successfully!")
