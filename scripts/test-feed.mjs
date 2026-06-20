const mirrors = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
];

const OVERPASS_QUERY = `
[out:json][timeout:300];
(
  node["military"]["name"];
  way["military"]["name"];
  relation["military"]["name"];
);
out center tags;
`.trim();

async function test() {
  for (const mirror of mirrors) {
    console.log('Testing mirror:', mirror);
    try {
      const res = await fetch(mirror, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      });
      console.log('  Status:', res.status);
      if (res.ok) {
        const text = await res.text();
        console.log('  Length:', text.length);
        console.log('  Snippet:', text.slice(0, 200));
        break;
      }
    } catch (err) {
      console.error('  Error:', err);
    }
  }
}

test();
