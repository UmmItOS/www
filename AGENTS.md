# UmmItOS Docs — Agent Guide

**Next.js 16 App Router + Fumadocs + Tailwind v4.** Docs site for the UmmItOS Linux distro.

## Commands

| Action | Command | Note |
|---|---|---|
| Dev | `bun run dev` | Turbopack on `:3000` |
| Dev (fast FS) | `bun run dev:fast` | Uses `/tmp/ummitos-next` for slow drives |
| Build | `bun run build` | Runs TypeScript checks |
| Install | `bun install` | Runs `postinstall` → regenerates `.source/` |

No `test`, `typecheck`, `lint`, or `preview` scripts. TS checks happen during `next build`. All scripts inject `NODE_OPTIONS=--no-deprecation` (DEP0205 from `fumadocs-mdx` on Node 26+).

## CI / Deploy

- **CI** (`.github/workflows/ci.yml`): push/PR to `master` → `bun install --frozen-lockfile` → `bun run build`.
- **Pre-commit** (`.husky/pre-commit`): `bun run build` (Husky v9).
- **Deploy**: Vercel auto-deploys on push to `master` (dashboard-connected).

## Content

- **MDX**: `content/docs/` — edit `.mdx` and `meta.json` alongside.
- **`meta.json`** controls sidebar nav. Keys match directory basenames or `.mdx` filenames (no extension).
- **Regenerate**: `bun install` runs `postinstall` → `fumadocs-mdx` scans `content/` → produces `.source/` (gitignored). Run after add/rename/delete of MDX.
- **Catch-all route**: `src/app/docs/[[...slug]]/page.tsx`.
- **Frontmatter**: Fumadocs default schema (`title`, `description`).

## Architecture

- **Aliases**: `@/` → `src/`, `@/.source` → `.source/index.ts`.
- **Components**: Server components by default. Files marked `'use client'`: `theme-toggle`, `youtube-player`, `collapsible`, `ui/popover`. `ui/toc-thumb` also runs client-side (uses hooks, no directive — only imported from client contexts). `scroll-area.tsx` uses Radix but has no directive; do not add one without testing.
- **CSS**: Tailwind v4 via `postcss.config.mjs`. Fumadocs CSS vars (`bg-fd-background`, `text-fd-foreground`, `border-fd-border`, etc.). No `tailwind.config.*`.
- **Icons**: `@iconify/react` + `lucide-react`.
- **Theme**: Dark-only (`defaultTheme: 'dark'`, `enableSystem: false`, hardcoded `dark` class on `<html>`). Theme toggle removed from navbar.
- **Version badge**: Fetched from `api.github.com/repos/UmmItOS/UmmItOS/tags` at build time via `src/lib/version.ts`. Falls back to `v0.7.0`.
- **Search**: Orama via Fumadocs `createFromSource`, `force-static` at `src/app/api/search/route.ts` (English language), vim-style `/` hotkey.

## Stale artifacts

- `cli.json` — scaffold artifact, no CLI commands defined.
- `content/docs/ummitos-main/configuration/keybinds.mdx` — orphaned, not in any `meta.json`.
