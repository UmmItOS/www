'use client';

import { useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export function YouTubePlayer({ videoId, title = 'Video' }: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Play button */}
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${title}`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg
              className="h-7 w-7 translate-x-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4">
          <div className="flex items-center gap-2 text-white/80">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <span className="text-sm font-medium">YouTube</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
