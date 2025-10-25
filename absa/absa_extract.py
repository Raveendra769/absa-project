import sys
import json
from transformers import pipeline
from nltk.tokenize import sent_tokenize
import nltk
import re

# Ensure NLTK punkt tokenizer is downloaded
nltk.download('punkt', quiet=True)

# ---------------- Setup ABSA Model ----------------
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

# ---------------- Aspect Keywords & Synonyms ----------------
aspect_synonyms = {
    "camera": ["camera", "cam"],
    "battery life": ["battery", "battery life", "batt"],
    "screen": ["screen", "display"],
    "sound": ["sound", "audio", "speaker"],
    "price": ["price", "cost", "value"],
    "performance": ["performance", "speed", "lag", "slow"],
    "design": ["design", "look", "style"],
    "build quality": ["build quality", "durability", "sturdy"],
}

# ---------------- Helper Functions ----------------
def split_sentence(sentence):
    """
    Split sentences on common conjunctions like 'but', 'and', 'however'
    to better assign sentiment per aspect.
    """
    parts = re.split(r'\b(but|and|however)\b', sentence, flags=re.IGNORECASE)
    # Remove conjunctions themselves from the list
    return [part.strip() for part in parts if part.lower() not in ['but', 'and', 'however'] and part.strip()]

def map_sentiment(label):
    """Map model label to readable sentiment"""
    label = label.lower()
    if label in ["label_0"]:  # Negative
        return "Negative"
    elif label in ["label_1"]:  # Neutral
        return "Neutral"
    else:  # Positive
        return "Positive"

# ---------------- Analyze Reviews ----------------
def analyze_reviews(text):
    aspects = []
    for sentence in sent_tokenize(text):
        sub_sentences = split_sentence(sentence)
        for sub in sub_sentences:
            result = sentiment_pipeline(sub)[0]
            sentiment = map_sentiment(result['label'])

            # Check which aspects are mentioned in this sub-sentence
            for aspect, synonyms in aspect_synonyms.items():
                if any(kw.lower() in sub.lower() for kw in synonyms):
                    aspects.append({
                        "aspect": aspect,
                        "sentiment": sentiment,
                        "sentence": sub
                    })
    return aspects

# ---------------- Command Line Interface ----------------
if __name__ == "__main__":
    text = " ".join(sys.argv[1:])
    if not text:
        print("[]")
        sys.exit()
    
    aspects = analyze_reviews(text)
    print(json.dumps(aspects, indent=2))
