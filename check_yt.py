import urllib.request
import json
import re

feeds = [
  {'id': 'jerusalem', 'videoId': 'e34xb-Fbl0U'},
  {'id': 'middle-east', 'videoId': 'oxT5R6I0N6E'},
  {'id': 'tel-aviv', 'videoId': 'gmtlJ_m2r5A'},
  {'id': 'mecca', 'videoId': 'kJwEsQTegxk'},
  {'id': 'beirut-mtv', 'videoId': 'djF-Lkgfp6k'},
  {'id': 'kyiv', 'videoId': '-Q7FuPINDjA'},
  {'id': 'odessa', 'videoId': 'e2gC37ILQmk'},
  {'id': 'paris', 'videoId': 'OzYp4NRZlwQ'},
  {'id': 'st-petersburg', 'videoId': 'CjtIYbmVfck'},
  {'id': 'london', 'videoId': 'Lxqcg1qt0XU'},
  {'id': 'washington', 'videoId': '1wV9lLe14aU'},
  {'id': 'new-york', 'videoId': '4qyZLflp-sI'},
  {'id': 'los-angeles', 'videoId': 'EO_1LWqsCNE'},
  {'id': 'miami', 'videoId': '5YCajRjvWCg'},
  {'id': 'taipei', 'videoId': 'z_fY1pj1VBw'},
  {'id': 'shanghai', 'videoId': '76EwqI5XZIc'},
  {'id': 'tokyo', 'videoId': '_k-5U7IeK8g'},
  {'id': 'seoul', 'videoId': '-JhoMGoAfFc'},
  {'id': 'sydney', 'videoId': '7pcL-0Wo77U'},
  {'id': 'iss-earth', 'videoId': 'vytmBNhc9ig'},
  {'id': 'nasa-live', 'videoId': 'zPH5KtjJFaQ'},
  {'id': 'space-x', 'videoId': 'fO9e9jnhYK8'},
  {'id': 'space-walk', 'videoId': 'fO9e9jnhYK8'}
]

for feed in feeds:
    url = f"https://www.youtube.com/watch?v={feed['videoId']}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});', html)
        if match:
            data = json.loads(match.group(1))
            status = data.get('playabilityStatus', {}).get('status')
            isLive = data.get('videoDetails', {}).get('isLiveContent', False)
            print(f"{feed['id']}: Status={status}, Live={isLive}")
        else:
            print(f"{feed['id']}: NO DATA")
    except urllib.error.HTTPError as e:
        print(f"{feed['id']}: HTTP {e.code}")
    except Exception as e:
        print(f"{feed['id']}: ERROR {str(e)}")
