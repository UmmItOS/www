'use client';

/* Hallmark · component: repo-card · genre: atmospheric
 * theme: project (near-black fd-* + brand purple #a78bfa)
 * states: default · hover · focus-visible · active · loading · error (stats fetch)
 *         disabled/success · n/a (static link card)
 * contrast: pass
 */

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface RepoStats {
  stars: number;
  forks: number;
}

function compact(n: number): string {
  return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function RepoCard({
  owner,
  repo,
  description,
}: {
  owner: string;
  repo: string;
  description: string;
}) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const key = `repo:${owner}/${repo}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setStats(JSON.parse(cached));
      setState('ready');
      return;
    }
    let alive = true;
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { stargazers_count: number; forks_count: number }) => {
        if (!alive) return;
        const s = { stars: d.stargazers_count, forks: d.forks_count };
        sessionStorage.setItem(key, JSON.stringify(s));
        setStats(s);
        setState('ready');
      })
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, [owner, repo]);

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative my-4 block overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-5 no-underline shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#a78bfa]/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* atmospheric purple glow, top-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#a78bfa]/10 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#a78bfa]/12 text-[#a78bfa] ring-1 ring-inset ring-[#a78bfa]/20">
          <Icon icon="mdi:github" className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-mono text-[15px] leading-tight">
            <span className="text-fd-muted-foreground">{owner}/</span>
            <span className="font-semibold text-fd-foreground">{repo}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">{description}</p>
        </div>

        <Icon
          icon="lucide:arrow-up-right"
          aria-hidden
          className="size-5 shrink-0 text-fd-muted-foreground/60 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#a78bfa] motion-reduce:transition-none"
        />
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
        {state === 'loading' && (
          <>
            <span className="h-6 w-16 animate-pulse rounded-full bg-fd-muted-foreground/10" />
            <span className="h-6 w-16 animate-pulse rounded-full bg-fd-muted-foreground/10" />
          </>
        )}

        {state === 'ready' && stats && (
          <>
            <Stat icon="lucide:star" label={compact(stats.stars)} />
            <Stat icon="lucide:git-fork" label={compact(stats.forks)} />
          </>
        )}

        {/* always-true fact, no network needed */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/30 px-2.5 py-1 font-medium text-fd-muted-foreground">
          <Icon icon="lucide:scale" className="size-3.5" aria-hidden />
          GPL-3.0
        </span>
      </div>
    </a>
  );
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/30 px-2.5 py-1 font-medium text-fd-foreground">
      <Icon icon={icon} className="size-3.5 text-[#a78bfa]" aria-hidden />
      {label}
    </span>
  );
}
