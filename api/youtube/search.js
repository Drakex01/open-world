// YouTube Search Scraper API
import { getCorsHeaders, isDisallowedOrigin } from '../_cors.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const cors = getCorsHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (isDisallowedOrigin(request)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: cors });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing q parameter' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const ytRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!ytRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch search results', videos: [] }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const html = await ytRes.text();
    const match = html.match(/var ytInitialData\s*=\s*({.+?});/);
    const videos = [];

    if (match) {
      const data = JSON.parse(match[1]);
      const searchResults = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
      if (searchResults) {
        for (const section of searchResults) {
          const itemSection = section.itemSectionRenderer?.contents;
          if (itemSection) {
            for (const item of itemSection) {
              const video = item.videoRenderer;
              if (video) {
                videos.push({
                  videoId: video.videoId,
                  title: video.title?.runs?.[0]?.text || '',
                  channel: video.ownerText?.runs?.[0]?.text || '',
                  published: video.publishedTimeText?.simpleText || '',
                  duration: video.lengthText?.simpleText || '',
                  viewCount: video.viewCountText?.simpleText || '',
                });
              }
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: {
        ...cors,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=600',
      },
    });
  } catch (error) {
    console.error('[YouTube Search] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', videos: [] }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
}
