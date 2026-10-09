import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getReleases } from '@/lib/releases';

const ACCENT = '#a78bfa';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// A one-line teaser: the first plain-prose paragraph (not a heading, list or table).
function teaser(body: string): string {
  const paras = body.replace(/\r\n/g, '\n').split(/\n\s*\n/);
  for (const p of paras) {
    const t = p.trim();
    if (t && !/^#{1,6}\s/.test(t) && !/^[-*>|]/.test(t) && !/^\d+\.\s/.test(t)) {
      return t.replace(/\s+/g, ' ');
    }
  }
  return '';
}

export async function Releases() {
  const releases = await getReleases();

  if (releases.length === 0) {
    return (
      <p className="text-sm text-fd-muted-foreground">
        Couldn&apos;t load releases right now.{' '}
        <a
          href="https://github.com/UmmItOS/UmmItOS/releases"
          target="_blank"
          rel="noreferrer noopener"
          className="underline hover:text-fd-foreground"
        >
          View them on GitHub
        </a>
        .
      </p>
    );
  }

  const latestTag = releases.find((r) => !r.prerelease)?.tag;

  return (
    <div className="relative my-6 ml-1.5 border-l border-fd-border pl-7">
      {releases.map((r) => {
        const isLatest = r.tag === latestTag;
        const badge = isLatest ? 'Latest' : r.prerelease ? 'Pre-release' : null;
        const summary = teaser(r.body);
        const hasNotes = r.body.trim().length > 0;

        return (
          <section key={r.tag} className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[2.05rem] top-1 size-3 rounded-full ring-4 ring-fd-background"
              style={{
                background: isLatest ? ACCENT : 'var(--color-fd-muted-foreground)',
                opacity: isLatest ? 1 : 0.4,
              }}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-xl font-semibold text-fd-foreground no-underline hover:text-[color:var(--accent)]"
                style={{ ['--accent' as string]: ACCENT }}
              >
                {r.tag}
              </a>
              {badge && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={
                    isLatest
                      ? { background: `${ACCENT}26`, color: ACCENT }
                      : { background: 'var(--color-fd-muted)', color: 'var(--color-fd-muted-foreground)' }
                  }
                >
                  {badge}
                </span>
              )}
              <span className="text-sm text-fd-muted-foreground">{fmtDate(r.date)}</span>
            </div>

            {summary && (
              <div className="mt-2 text-sm text-fd-muted-foreground [&_a]:text-[color:var(--accent)] [&_a]:underline" style={{ ['--accent' as string]: ACCENT }}>
                <Markdown remarkPlugins={[remarkGfm]}>{summary}</Markdown>
              </div>
            )}

            {hasNotes && (
              <details className="group mt-2">
                <summary className="inline-flex cursor-pointer select-none items-center gap-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground">
                  <span className="transition-transform group-open:rotate-90">▸</span>
                  <span className="group-open:hidden">Show full notes</span>
                  <span className="hidden group-open:inline">Hide full notes</span>
                </summary>
                <div className="mt-3 rounded-xl bg-fd-muted/30 p-4 text-sm [&_a]:text-[color:var(--accent)] [&_a]:underline [&_h2]:mt-4 [&_h2]:text-base [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_li]:my-0.5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5" style={{ ['--accent' as string]: ACCENT }}>
                  <Markdown remarkPlugins={[remarkGfm]}>{r.body}</Markdown>
                </div>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
