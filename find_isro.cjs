const https = require('https');
https.get('https://www.youtube.com/@isroofficial5866/streams', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const matches = [...data.matchAll(/"videoId":"([^"]+)"/g)];
    if (matches.length > 0) {
      console.log('Found IDs: ' + [...new Set(matches.map(m => m[1]))].slice(0, 5).join(', '));
    } else {
      console.log('No streams found');
    }
  });
}).on('error', console.error);
