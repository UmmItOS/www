# UmmIt Docs — Agent Guide

**UmmItOS documentation site.** Next.js 16 App Router + Fumadocs + Tailwind CSS v4.

## Commands

| Action | Command | Notes |
|---|---|---|
| Dev server | `bun run dev` | Turbopack on :3000 |
| Build | `bun run build` | Next.js production build |
| Production | `bun run start` | After build |
| Install | `bun install` | Runs `postinstall` → regenerates `.source/` |

No `lint`, `typecheck`, `test`, `preview`, or `codegen` scripts exist. Linting only runs implicitly during `next build`.

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
