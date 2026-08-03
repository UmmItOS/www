# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See [AGENTS.md](./AGENTS.md) for the full guide. Key points:

## Commands

- **Dev**: `bun run dev` (Turbopack, `:3000`). `bun run dev:fast` uses `/tmp/ummitos-next` for slow drives.
- **Build**: `bun run build` — also runs TypeScript checks (there is no separate `typecheck`/`lint`/`test` script).
- **Install**: `bun install` — `postinstall` runs `fumadocs-mdx` to regenerate the gitignored `.source/`. Re-run after any add/rename/delete of MDX content.
- All scripts inject `NODE_OPTIONS=--no-deprecation` to silence DEP0205 from `fumadocs-mdx` on Node 26+.
- CI and the Husky pre-commit hook both run `bun run build`; Vercel auto-deploys on push to `master`.

## Architecture

Next.js 16 App Router + Fumadocs + Tailwind v4 docs site for the UmmItOS Linux distro.

- **Content**: MDX lives in `content/docs/`. `meta.json` files control sidebar nav (keys match directory basenames or `.mdx` filenames without extension). Served through the catch-all route `src/app/docs/[[...slug]]/page.tsx`.
- **Source generation**: `fumadocs-mdx` scans `content/` → produces `.source/` (aliased as `@/.source`). `@/` → `src/`.
- **Components**: Server components by default. `'use client'` only where noted in AGENTS.md — do not add the directive to `scroll-area.tsx` or `ui/toc-thumb` without testing.
- **CSS**: Tailwind v4 via `postcss.config.mjs`, no `tailwind.config.*`. Use Fumadocs CSS vars (`bg-fd-background`, `text-fd-foreground`, `border-fd-border`, …).
- **Theme**: Dark-only, hardcoded `dark` class on `<html>`; toggle removed from navbar.
- **Version badge**: fetched at build time from GitHub tags via `src/lib/version.ts`, falling back to `v0.7.0`.
- **Search**: Orama via Fumadocs `createFromSource`, `force-static` at `src/app/api/search/route.ts`.

## Stale artifacts

- `cli.json` — scaffold artifact, no CLI commands defined.
- `content/docs/ummitos-main/configuration/keybinds.mdx` — orphaned, not in any `meta.json`.
