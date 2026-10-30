/* Lightweight inline clip for docs. A short, muted, looping <video> is far
 * smaller than a GIF and needs no JavaScript. Usage in MDX:
 *
 *   import { Video } from '@/components/video';
 *   <Video mp4="/clip.mp4" webm="/clip.webm" poster="/clip.jpg" caption="…" />
 *
 * For a longer clip the reader should start themselves, pass `controls`.
 */
export function Video({
  mp4,
  webm,
  poster,
  caption,
  controls = false,
}: {
  mp4: string;
  webm?: string;
  poster?: string;
  caption?: string;
  controls?: boolean;
}) {
  return (
    <figure className="my-5">
      <video
        className="w-full rounded-xl border border-fd-border shadow-lg"
        poster={poster}
        autoPlay={!controls}
        muted
        loop={!controls}
        playsInline
        controls={controls}
        preload="metadata"
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
