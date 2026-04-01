import fs from "fs";
import path from "path";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  isShort: boolean;
}

export interface VideosData {
  longForm: Video[];
  shorts: Video[];
  lastFetched: string;
}

const DATA_PATH = path.join(process.cwd(), "public", "data", "videos.json");

const FALLBACK_DATA: VideosData = {
  longForm: [],
  shorts: [],
  lastFetched: new Date().toISOString(),
};

export async function getVideos(): Promise<VideosData> {
  // Try to read cached data first
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const data = JSON.parse(raw) as VideosData;
      return data;
    }
  } catch (err) {
    console.error("Failed to read videos cache:", err);
  }

  // If no cache file, try fetching from YouTube API at build time
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not set — returning empty video list");
    return FALLBACK_DATA;
  }

  try {
    return await fetchFromYouTube(apiKey);
  } catch (err) {
    console.error("YouTube API fetch failed:", err);
    return FALLBACK_DATA;
  }
}

export async function fetchFromYouTube(apiKey: string): Promise<VideosData> {
  // First, find the channel ID from the handle
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=FindingRad&key=${apiKey}`
  );

  if (!channelRes.ok) {
    throw new Error(`Channel lookup failed: ${channelRes.status}`);
  }

  const channelData = await channelRes.json();
  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error("Could not find uploads playlist");
  }

  // Fetch latest 50 videos from uploads playlist
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
  );

  if (!playlistRes.ok) {
    throw new Error(`Playlist fetch failed: ${playlistRes.status}`);
  }

  const playlistData = await playlistRes.json();
  const items = playlistData.items || [];

  // Get video IDs for duration lookup
  const videoIds = items
    .map((item: PlaylistItem) => item.snippet?.resourceId?.videoId)
    .filter(Boolean)
    .join(",");

  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`
  );

  const detailsData = await detailsRes.json();
  const details: VideoDetails[] = detailsData.items || [];

  const detailsMap = new Map(details.map((v) => [v.id, v]));

  const videos: Video[] = items
    .map((item: PlaylistItem) => {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) return null;

      const detail = detailsMap.get(videoId);
      const duration = detail?.contentDetails?.duration;
      const isShort = isYouTubeShort(duration || "");

      return {
        id: videoId,
        title: item.snippet?.title || "Untitled",
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: formatDate(item.snippet?.publishedAt || ""),
        duration: parseDuration(duration || ""),
        isShort,
      } as Video;
    })
    .filter(Boolean) as Video[];

  const longForm = videos.filter((v) => !v.isShort);
  const shorts = videos.filter((v) => v.isShort);

  const result: VideosData = {
    longForm,
    shorts,
    lastFetched: new Date().toISOString(),
  };

  return result;
}

// ISO 8601 duration → human-readable (e.g. "PT12M34S" → "12:34")
function parseDuration(iso: string): string {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";

  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

// YouTube Shorts are <= 60 seconds
function isYouTubeShort(iso: string): boolean {
  if (!iso) return false;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;

  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");

  const totalSeconds = h * 3600 + m * 60 + s;
  return totalSeconds <= 60;
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Types for YouTube API response
interface PlaylistItem {
  snippet?: {
    title?: string;
    publishedAt?: string;
    resourceId?: {
      videoId?: string;
    };
    thumbnails?: {
      maxres?: { url: string };
      high?: { url: string };
      medium?: { url: string };
    };
  };
}

interface VideoDetails {
  id: string;
  contentDetails?: {
    duration?: string;
  };
  snippet?: {
    title?: string;
  };
}
