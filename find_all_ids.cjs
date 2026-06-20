const https = require('https');
const feeds = [
  { id: 'jerusalem', channel: '@TheWesternWall' },
  { id: 'middle-east', channel: '@MiddleEastCams' },
  { id: 'tel-aviv', channel: '@IsraelLiveCam' },
  { id: 'mecca', channel: '@MakkahLive' },
  { id: 'beirut-mtv', channel: '@MTVLebanonNews' },
  { id: 'kyiv', channel: '@DWNews' },
  { id: 'odessa', channel: '@UkraineLiveCam' },
  { id: 'paris', channel: '@PalaisIena' },
  { id: 'st-petersburg', channel: '@SPBLiveCam' },
  { id: 'london', channel: '@SkyNews' },
  { id: 'washington', channel: '@AxisCommunications' },
  { id: 'new-york', channel: '@EarthCam' },
  { id: 'los-angeles', channel: '@VeniceVHotel' },
  { id: 'miami', channel: '@FloridaLiveCams' },
  { id: 'taipei', channel: '@JackyWuTaipei' },
  { id: 'shanghai', channel: '@SkylineWebcams' },
  { id: 'tokyo', channel: '@TokyoLiveCam4K' },
  { id: 'seoul', channel: '@DailySeoul' },
  { id: 'sydney', channel: '@WebcamSydney' },
  { id: 'iss-earth', channel: '@NASA' },
  { id: 'nasa-live', channel: '@NASA' },
  { id: 'space-x', channel: '@SpaceX' },
  { id: 'space-walk', channel: '@NASA' }
];

async function run() {
  for (const f of feeds) {
    await new Promise(r => {
      https.get('https://www.youtube.com/' + f.channel + '/live', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          const match = data.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/);
          if (match) console.log(f.id + ' -> ' + match[1]);
          else console.log(f.id + ' -> NOT FOUND');
          r();
        });
      }).on('error', () => { console.log(f.id + ' -> ERROR'); r(); });
    });
  }
}
run();
