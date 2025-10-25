from textblob import TextBlob

def analyze_sentiment(comment):
    """Return sentiment as Positive, Negative, or Neutral"""
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity > 0.1:
        return "Positive"
    elif analysis.sentiment.polarity < -0.1:
        return "Negative"
    else:
        return "Neutral"
