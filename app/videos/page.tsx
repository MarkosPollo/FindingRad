"use client";

import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import type { Video, VideosData } from "@/lib/youtube";

export default function VideosPage() {
  const [data, setData] = useState<VideosData | null>(null);
  const [tab, setTab] = useState<"long" | "shorts">("long");

  useEffect(() => {
    fetch("/data/videos.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ longForm: [], shorts: [], lastFetched: "" }));
  }, []);

  const videos: Video[] = tab === "long" ? (data?.longForm || []) : (data?.shorts || []);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-fraunces text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            All Videos
          </h1>
          <p className="text-gray-600 text-lg">
            Every video I&apos;ve made. Long-form deep dives and quick Shorts.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("long")}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
              tab === "long"
                ? "bg-charcoal text-white"
                : "bg-gray-100 text-charcoal hover:bg-gray-200"
            }`}
          >
            Long-form {data ? `(${data.longForm.length})` : ""}
          </button>
          <button
            onClick={() => setTab("shorts")}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
              tab === "shorts"
                ? "bg-charcoal text-white"
                : "bg-gray-100 text-charcoal hover:bg-gray-200"
            }`}
          >
            Shorts {data ? `(${data.shorts.length})` : ""}
          </button>
        </div>

        {!data ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg animate-pulse" style={{ aspectRatio: "16/9" }} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No videos cached yet.</p>
            <a
              href="https://youtube.com/@FindingRad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-yellow inline-block"
            >
              Watch on YouTube
            </a>
          </div>
        ) : tab === "long" ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} isShort />
            ))}
          </div>
        )}

        {data?.lastFetched && (
          <p className="text-xs text-gray-400 mt-8 text-center">
            Last updated:{" "}
            {new Date(data.lastFetched).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
