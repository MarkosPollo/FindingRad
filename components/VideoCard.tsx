import Image from "next/image";
import type { Video } from "@/lib/youtube";

interface VideoCardProps {
  video: Video;
  isShort?: boolean;
}

export default function VideoCard({ video, isShort = false }: VideoCardProps) {
  const youtubeUrl = `https://youtube.com/watch?v=${video.id}`;

  if (isShort) {
    return (
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block video-card group"
        style={{ aspectRatio: "9/16", maxWidth: "220px" }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/80 to-transparent">
            <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
              {video.title}
            </p>
          </div>
          {video.duration && (
            <span className="absolute top-2 right-2 bg-charcoal/90 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </span>
          )}
        </div>
      </a>
    );
  }

  return (
    <div className="video-card group">
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-charcoal/90 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </a>
      <div className="p-4">
        <h3 className="font-semibold text-charcoal text-sm leading-snug mb-2 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{video.publishedAt}</p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-charcoal hover:text-yellow transition-colors"
          >
            Watch Now &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
