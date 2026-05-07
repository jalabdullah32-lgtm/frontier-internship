    
from urllib.parse import urlparse, parse_qs
def validate(url):
        video_id = url.split("v=")[-1]
        parsed = urlparse(url)
        print(parsed.netloc)
        if "/shorts/" in url:
            raise ValueError("Shorts are not supported, please use a lecture video")
        return video_id

url = 'https://google.com/watch?v=vaayyBy66fs'
validate(url)