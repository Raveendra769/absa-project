import requests
from bs4 import BeautifulSoup

def scrape_flipkart_reviews(url):
    """
    Scrape reviews from a Flipkart product page.
    Returns a list of dictionaries: [{'user':..., 'comment':..., 'aspect':...}, ...]
    """
    reviews = []
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    review_blocks = soup.find_all("div", class_="_27M-vq")  # Flipkart review container class
    for block in review_blocks:
        user = block.find("p", class_="_2sc7ZR").text.strip()
        comment = block.find("div", class_="t-ZTKy").text.strip()
        # For now, aspect is "General". You can improve with aspect extraction later
        reviews.append({"user": user, "aspect": "General", "comment": comment})

    return reviews
