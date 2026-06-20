import { toApiUrl } from '@/services/runtime';

interface LiveVideoInfo {
  videoId: string | null;
  hlsUrl: string | null;
}

const liveVideoCache = new Map<string, { videoId: string | null; hlsUrl: string | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchLiveVideoInfo(channelHandle: string): Promise<LiveVideoInfo> {
  const cached = liveVideoCache.get(channelHandle);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { videoId: cached.videoId, hlsUrl: cached.hlsUrl };
  }

  try {
    const res = await fetch(toApiUrl(`/api/youtube/live?channel=${encodeURIComponent(channelHandle)}`));
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const videoId = data.videoId || null;
    const hlsUrl = data.hlsUrl || null;
    liveVideoCache.set(channelHandle, { videoId, hlsUrl, timestamp: Date.now() });
    return { videoId, hlsUrl };
  } catch (error) {
    console.warn(`[LiveNews] Failed to fetch live info for ${channelHandle}:`, error);
    return { videoId: null, hlsUrl: null };
  }
}

/** @deprecated Use fetchLiveVideoInfo instead */
export async function fetchLiveVideoId(channelHandle: string): Promise<string | null> {
  const info = await fetchLiveVideoInfo(channelHandle);
  return info.videoId;
}

export interface RecordedVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnailUrl: string;
}

export async function fetchRecentVideos(channelId: string): Promise<RecordedVideo[]> {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(toApiUrl(`/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`));
    if (!res.ok) throw new Error('Proxy error fetching YouTube feed');
    const xmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const entries = doc.getElementsByTagName('entry');
    const videos: RecordedVideo[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry) continue;
      const videoIdEl = entry.getElementsByTagName('yt:videoId')[0] || entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0];
      const videoId = videoIdEl?.textContent || '';

      const titleEl = entry.getElementsByTagName('title')[0];
      const title = titleEl?.textContent || '';

      const publishedEl = entry.getElementsByTagName('published')[0];
      const published = publishedEl?.textContent || '';

      const mediaGroup = entry.getElementsByTagName('media:group')[0] || entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'group')[0];
      let thumbnailUrl = '';
      if (mediaGroup) {
        const thumbnailEl = mediaGroup.getElementsByTagName('media:thumbnail')[0] || mediaGroup.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        thumbnailUrl = thumbnailEl?.getAttribute('url') || '';
      }

      if (!thumbnailUrl && videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      if (videoId) {
        videos.push({
          videoId,
          title,
          published,
          thumbnailUrl,
        });
      }
    }

    return videos;
  } catch (error) {
    console.warn(`[LiveNews] Failed to fetch recent videos for channel ${channelId}:`, error);
    return [];
  }
}

