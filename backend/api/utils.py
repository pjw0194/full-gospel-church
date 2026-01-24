import requests
from bs4 import BeautifulSoup

def get_godpeople_verse():
    try:
        url = "https://mw.godpeople.com/?GO=daily_bible"
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.content, 'html.parser')

        text_element = soup.select_one('.txt')
        ref_element = soup.select_one('.b_name')

        if text_element and ref_element:
            text = text_element.get_text(strip=True)
            ref = ref_element.get_text(strip=True)
            return {"text": text, "ref": ref}
        
        return {"text": "주의 말씀은 내 발의 등이요 내 길의 빛이니이다", "ref": "시편 119:105"}
    
    except Exception as e:
        print(f"Crawling Error: {e}")
        return {"text": "태초에 하나님이 천지를 창조하시니라", "ref": "창세기 1:1"}