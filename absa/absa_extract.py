import sys
import json
from transformers import pipeline
from nltk.tokenize import sent_tokenize
import nltk

# Ensure NLTK punkt tokenizer is downloaded
nltk.download('punkt', quiet=True)

# --------- Use a better sentiment model ---------
# This model can detect Positive/Negative/Neutral more accurately
sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

# --------- Define aspect keywords ---------
aspects_keywords = [
    "camera", "battery life", "screen", "sound", 
    "price", "performance", "design", "build quality", "display"
]

# --------- Analyze text ---------
def analyze_reviews(text):
    aspects = []

    for sentence in sent_tokenize(text):
        # Run sentiment on sentence
        result = sentiment_pipeline(sentence)[0]
        sentiment_label = result['label'].lower()  # LABEL_0, LABEL_1, LABEL_2

        # Map to readable sentiment
        if sentiment_label in ["label_0"]:  # Negative
            sentiment = "Negative"
        elif sentiment_label in ["label_1"]:  # Neutral
            sentiment = "Neutral"
        else:  # Positive
            sentiment = "Positive"

        # Check which aspects are mentioned in this sentence
        for kw in aspects_keywords:
            if kw.lower() in sentence.lower():
                aspects.append({
                    "aspect": kw,
                    "sentiment": sentiment
                })

    return aspects

# --------- Run from command line ---------
if __name__ == "__main__":
    text = " ".join(sys.argv[1:])
    if not text:
        print("[]")
        sys.exit()

    aspects = analyze_reviews(text)
    print(json.dumps(aspects))
