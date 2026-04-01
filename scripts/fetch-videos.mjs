/**
 * fetch-videos.mjs
 * 
 * Fetches YouTube channel videos and writes to public/data/videos.json
 * Run manually: node scripts/fetch-videos.mjs
 * Or set YOUTUBE_API_KEY in env and it runs automatically.
 * 
 * Usage:
 *   YOUTUBE_API_KEY=your_key node scripts/fetch-videos.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "public", "data", "videos.json");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = "FindingRad";

if (!YOUTUBE_API_KEY) {
  console.error("❌ YOUTUBE_API_KEY env var not set.");
  process.exit(1);
}

async function main() {
  console.log("🎬 Fetching Finding Rad videos from YouTube...");

  // 1. Get channel info / uploads playlist
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
  );

  if (!channelRes.ok) {
    console.error("❌ Channel lookup failed:", channelRes.status, await channelRes.text());
    process.exit(1);
  }

  const channelData = await channelRes.json();
  
  if (channelData.error) {
    console.error("❌ YouTube API error:", JSON.stringify(channelData.error));
    process.exit(1);
  }

  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    console.error("❌ Could not find uploads playlist for @" + CHANNEL_HANDLE);
    console.log("Channel data:", JSON.stringify(channelData, null, 2));
    process.exit(1);
  }

  console.log(`✅ Found uploads playlist: ${uploadsPlaylistId}`);

  // 2. Fetch up to 50 recent videos
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
  );

  if (!playlistRes.ok) {
    console.error("❌ Playlist fetch failed:", playlistRes.status);
    process.exit(1);
  }

  const playlistData = await playlistRes.json();
  
  if (playlistData.error) {
    console.error("❌ YouTube API error:", JSON.stringify(playlistData.error));
    process.exit(1);
  }

  const items = playlistData.items || [];
  console.log(`📦 Found ${items.length} videos in playlist`);

  // 3. Get details (duration etc)
  const videoIds = items
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter(Boolean)
    .join(",");

  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
  );

  const detailsData = await detailsRes.json();
  const details = detailsData.items || [];
  const detailsMap = new Map(details.map((v) => [v.id, v]));

  // 4. Process and classify
  const videos = items
    .map((item) => {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) return null;

      const detail = detailsMap.get(videoId);
      const duration = detail?.contentDetails?.duration || "";
      const isShort = isYouTubeShort(duration);

      return {
        id: videoId,
        title: item.snippet?.title || "Untitled",
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: formatDate(item.snippet?.publishedAt || ""),
        duration: parseDuration(duration),
        isShort,
      };
    })
    .filter(Boolean);

  const longForm = videos.filter((v) => !v.isShort);
  const shorts = videos.filter((v) => v.isShort);

  const result = {
    longForm,
    shorts,
    lastFetched: new Date().toISOString(),
  };

  // 5. Write to public/data/videos.json
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));

  console.log(`✅ Wrote ${longForm.length} long-form + ${shorts.length} Shorts to ${OUTPUT_PATH}`);
}

function parseDuration(iso) {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function isYouTubeShort(iso) {
  if (!iso) return false;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  return h * 3600 + m * 60 + s <= 60;
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
