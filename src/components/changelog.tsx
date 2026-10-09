import type { ReactNode } from 'react';

/* Hand-editable changelog timeline. Usage in MDX:
 *
 *   import { Changelog, Release } from '@/components/changelog';
 *
 *   <Changelog>
 *     <Release version="v1.0.0-rc2" date="October 1, 2026" badge="Latest">
 *       - **Languages**: …
 *     </Release>
 *   </Changelog>
 */

const ACCENT = '#a78bfa';

export function Changelog({ children }: { children: ReactNode }) {
  return <div className="relative my-6 ml-1.5 border-l border-fd-border pl-7">{children}</div>;
}

export function Release({
  version,
  date,
  badge,
  children,
}: {
  version: string;
  date: string;
  badge?: string;
  children: ReactNode;
}) {
  const latest = badge?.toLowerCase() === 'latest';

  return (
    <section className="relative pb-10 last:pb-0">
      {/* timeline dot */}
      <span
        aria-hidden
        className="absolute -left-[2.05rem] top-1 size-3 rounded-full ring-4 ring-fd-background"
        style={{ background: latest ? ACCENT : 'var(--color-fd-muted-foreground)', opacity: latest ? 1 : 0.4 }}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-mono text-xl font-semibold text-fd-foreground">{version}</span>
        {badge && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={
              latest
                ? { background: `${ACCENT}26`, color: ACCENT }
                : { background: 'var(--color-fd-muted)', color: 'var(--color-fd-muted-foreground)' }
            }
          >
            {badge}
          </span>
        )}
        <span className="text-sm text-fd-muted-foreground">{date}</span>
      </div>

      <div className="mt-3 text-sm [&_ul]:my-2">{children}</div>
    </section>
  );
}
