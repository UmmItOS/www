/* A still screenshot for docs, framed to match the Video component. Usage:
 *
 *   import { Shot } from '@/components/shot';
 *   <Shot src="/screen.png" alt="…" caption="…" />
 */
export function Shot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? caption ?? ''}
        loading="lazy"
        className="w-full rounded-xl border border-fd-border shadow-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
