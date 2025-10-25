import requests
from bs4 import BeautifulSoup

# Flipkart product review URL
product_url = "https://www.flipkart.com/product-name/p/itmfabc12345"

# Headers to mimic browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

response = requests.get(product_url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find review divs (inspect Flipkart page to get exact class)
review_divs = soup.find_all("div", {"class": "_16PBlm"})  # update if different
