from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from transformers import pipeline
from nltk.tokenize import sent_tokenize
import nltk

# Download NLTK punkt tokenizer
nltk.download('punkt', quiet=True)

# Initialize FastAPI
app = FastAPI(title="ABSA API", version="1.0")

# Initialize sentiment pipeline
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

# Aspect keywords
aspects_keywords = [
    "camera", "battery life", "screen", "sound",
    "price", "performance", "design", "build quality", "display"
]

# Request model
class ReviewRequest(BaseModel):
    text: str

# Response model
class AspectSentiment(BaseModel):
    aspect: str
    sentiment: str
    sentence: str

# --------- Helper function ---------
def analyze_reviews(text: str) -> List[AspectSentiment]:
    aspects = []
    for sentence in sent_tokenize(text):
        result = sentiment_pipeline(sentence)[0]
        label = result['label'].lower()
        if label == "label_0":
            sentiment = "Negative"
        elif label == "label_1":
            sentiment = "Neutral"
        else:
            sentiment = "Positive"
        for kw in aspects_keywords:
            if kw.lower() in sentence.lower():
                aspects.append({
                    "aspect": kw,
                    "sentiment": sentiment,
                    "sentence": sentence
                })
    return aspects

# --------- API Endpoint ---------
@app.post("/analyze", response_model=List[AspectSentiment])
def analyze(request: ReviewRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return analyze_reviews(request.text)
