# UmmIt Docs — Agent Guide

**UmmItOS documentation site.** Next.js 16 App Router + Fumadocs + Tailwind CSS v4.

## Commands

| Action | Command | Notes |
|---|---|---|
| Dev server | `bun run dev` | Turbopack on :3000 |
| Dev (fast FS) | `bun run dev:fast` | Uses `/tmp/ummitos-next` for slow mounted drives |
| Build | `bun run build` | Next.js production build (Vercel-ready) |
| Production | `bun run start` | After build |
| Install | `bun install` | Runs `postinstall` → regenerates `.source/` |

No `typecheck`, `test`, `preview`, or `codegen` scripts exist. TypeScript checks run during `next build`. All scripts inject `NODE_OPTIONS=--no-deprecation` (DEP0205 from `fumadocs-mdx` on Node 26+).

## CI / Pre-commit

- **CI** (`.github/workflows/ci.yml`): Runs on push/PR to `master` — `bun install --frozen-lockfile` → `bun run build`.
- **Deploy**: Vercel auto-deploys on push to `master` (connected via Vercel dashboard).
- **Pre-commit hook** (`.husky/pre-commit`): Runs `bun run build` before every commit. Managed by Husky v9.

## Content workflow

- **MDX source**: `content/docs/` — edit `.mdx` files and `meta.json` alongside them
- **`meta.json`** controls sidebar navigation. `pages` array uses `"---Section Name---"` for separators. Keys match directory basenames or `.mdx` filenames (without extension).
- **Generated code**: `postinstall` (`fumadocs-mdx`) scans `content/` and produces `.source/` (gitignored). After adding/renaming/deleting MDX files, re-run `bun install` to regenerate.
- **Catch-all route**: `src/app/docs/[[...slug]]/page.tsx` renders all doc pages dynamically.
- **Frontmatter**: Uses Fumadocs default schema (`title`, `description`). Customize in `source.config.ts`.

## Architecture

- **Path alias**: `@/` → `src/`, `@/.source` → `.source/index.ts`
- **Components**: Server components by default. Mark interactive ones with `'use client'`. Existing client components: `theme-toggle`, `youtube-player`, `collapsible`, `popover`, `scroll-area`.
- **CSS**: Tailwind v4 (no `tailwind.config.*`). Config via `postcss.config.mjs` + CSS `@import`. Use Fumadocs CSS variables (`bg-fd-background`, `text-fd-foreground`, `border-fd-border`, etc.) for theme consistency.
- **Icons**: `@iconify/react` + `lucide-react`.
- **Search**: Powered by Orama via Fumadocs `createFromSource`. API route at `src/app/api/search/route.ts`.

## Known issues

- **`make-flag`** is referenced in `content/docs/meta.json` but has no corresponding file — broken nav link.
- **`keybinds.mdx`** at `content/docs/ummitos-main/configuration/` is not listed in `meta.json` — orphaned page.
- `cli.json` is a scaffold artifact (no CLI commands defined).
