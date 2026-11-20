'use client';

/* Inline docs clip: a short, muted, looping <video> with a small player bar.
 * Clips start only when scrolled into view (and pause when they leave), so a
 * page with several clips doesn't decode them all on load. Usage in MDX:
 *
 *   import { Video } from '@/components/video';
 *   <Video mp4="/clip.mp4" webm="/clip.webm" poster="/clip.jpg" caption="…" />
 */
import { useEffect, useRef, useState } from 'react';

type Clip = {
  playing: boolean;
  time: number;
  duration: number;
};

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function Video({
  mp4,
  webm,
  poster,
  caption,
}: {
  mp4: string;
  webm?: string;
  poster?: string;
  caption?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [clip, setClip] = useState<Clip>({
    playing: false,
    time: 0,
    duration: 0,
  });
  const userPaused = useRef(false);

  const sync = () => {
    const el = video.current;
    if (!el) return;
    setClip((c) => ({
      ...c,
      playing: !el.paused,
      time: el.currentTime,
      duration: Number.isFinite(el.duration) ? el.duration : 0,
    }));
  };

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    sync();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return el.pause();
        if (reduced.matches || userPaused.current) return;
        el.play().catch(() => {});
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    userPaused.current = !el.paused;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <figure data-clip className="my-5">
      <video
        ref={video}
        className="w-full rounded-xl border border-fd-border shadow-lg"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={sync}
        onPause={sync}
        onTimeUpdate={sync}
        onLoadedMetadata={sync}
        onDurationChange={sync}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-3 py-1.5 text-xs text-fd-muted-foreground">
        <button
          type="button"
          onClick={toggle}
          aria-label={clip.playing ? 'Pause clip' : 'Play clip'}
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-fd-foreground hover:bg-fd-accent"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            {clip.playing ? (
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={clip.duration}
          step={0.01}
          value={clip.time}
          onChange={(e) => {
            const t = Number(e.target.value);
            if (video.current) video.current.currentTime = t;
            setClip((c) => ({ ...c, time: t }));
          }}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-fd-primary"
        />
        <span className="shrink-0 tabular-nums">
          {fmt(clip.time)} / {fmt(clip.duration)}
        </span>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
