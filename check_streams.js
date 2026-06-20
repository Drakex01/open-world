const feeds = [
  { id: 'jerusalem', videoId: 'e34xb-Fbl0U' },
  { id: 'middle-east', videoId: 'oxT5R6I0N6E' },
  { id: 'tel-aviv', videoId: 'gmtlJ_m2r5A' },
  { id: 'mecca', videoId: 'kJwEsQTegxk' },
  { id: 'beirut-mtv', videoId: 'djF-Lkgfp6k' },
  { id: 'kyiv', videoId: '-Q7FuPINDjA' },
  { id: 'odessa', videoId: 'e2gC37ILQmk' },
  { id: 'paris', videoId: 'OzYp4NRZlwQ' },
  { id: 'st-petersburg', videoId: 'CjtIYbmVfck' },
  { id: 'london', videoId: 'Lxqcg1qt0XU' },
  { id: 'washington', videoId: '1wV9lLe14aU' },
  { id: 'new-york', videoId: '4qyZLflp-sI' },
  { id: 'los-angeles', videoId: 'EO_1LWqsCNE' },
  { id: 'miami', videoId: '5YCajRjvWCg' },
  { id: 'taipei', videoId: 'z_fY1pj1VBw' },
  { id: 'shanghai', videoId: '76EwqI5XZIc' },
  { id: 'tokyo', videoId: '_k-5U7IeK8g' },
  { id: 'seoul', videoId: '-JhoMGoAfFc' },
  { id: 'sydney', videoId: '7pcL-0Wo77U' },
  { id: 'iss-earth', videoId: 'vytmBNhc9ig' },
  { id: 'nasa-live', videoId: 'zPH5KtjJFaQ' },
  { id: 'space-x', videoId: 'fO9e9jnhYK8' }
];

async function check() {
  for (const feed of feeds) {
    try {
      const res = await fetch('https://www.youtube.com/watch?v=' + feed.videoId, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const text = await res.text();
      if (!text.includes('"isLive":true') && !text.includes('isLiveNow":true')) {
        console.log(feed.id + ' is NOT LIVE');
      } else if (text.includes('UNPLAYABLE')) {
        console.log(feed.id + ' is UNPLAYABLE');
      } else {
        console.log(feed.id + ' is OK');
      }
    } catch (e) {
      console.log(feed.id + ' error: ' + e.message);
    }
  }
}
check();
