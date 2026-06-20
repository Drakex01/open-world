const https = require('https');
const channels = {
  'seoul': 'https://www.youtube.com/@DailySeoul/live',
  'tokyo': 'https://www.youtube.com/@TokyoLiveCam4K/live',
  'taipei': 'https://www.youtube.com/@JackyWuTaipei/live',
  'london': 'https://www.youtube.com/@SkyNews/live',
  'paris': 'https://www.youtube.com/@PalaisIena/live',
  'middle-east': 'https://www.youtube.com/@MiddleEastCams/live',
  'tel-aviv': 'https://www.youtube.com/@IsraelLiveCam/live',
  'beirut-mtv': 'https://www.youtube.com/@MTVLebanonNews/live',
  'odessa': 'https://www.youtube.com/@UkraineLiveCam/live',
  'st-petersburg': 'https://www.youtube.com/@SPBLiveCam/live',
  'washington': 'https://www.youtube.com/@AxisCommunications/live',
  'new-york': 'https://www.youtube.com/@EarthCam/live',
  'los-angeles': 'https://www.youtube.com/@VeniceVHotel/live',
  'miami': 'https://www.youtube.com/@FloridaLiveCams/live'
};

Object.entries(channels).forEach(([name, url]) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const match = data.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/);
      if (match) {
        console.log(name + ' ID: ' + match[1]);
      } else {
        console.log(name + ' NOT FOUND');
      }
    });
  }).on('error', e => console.error(name + ' error', e));
});
