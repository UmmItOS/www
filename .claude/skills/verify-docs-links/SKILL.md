---
name: verify-docs-links
description: Exhaustively check that every internal /docs link, #anchor and sidebar entry in the UmmItOS docs site resolves. Use after adding, renaming, moving or deleting any file in content/docs/, editing a meta.json, or changing a href="/docs…" in src/.
---

# Docs link integrity

**Run:** `node .claude/skills/verify-docs-links/check-links.mjs` from the repo root (about 1 second, needs only `bun install` for `github-slugger`). It prints `PASS` or one line per violation and exits 1.

**Not a model checker.** The site has no concurrency or stateful logic, so TLA+ or a prover would model nothing real. The property is over a finite set (the files in the repo), so the script checks every case on the real files. A pass is a proof for the current tree, not for any future one.

## Properties (plain words)

| ID | Promise | Harm if broken |
|---|---|---|
| P1 | Every `/docs/...` link in `content/docs/**/*.mdx` and `src/**/*.ts(x)` points at an existing page. | Reader hits a 404. |
| P2 | Every `#anchor` in such a link matches a heading of the target page (GitHub slug rules). | Link lands at the top, not the section. |
| P3 | Every `.mdx` is reachable from `content/docs/meta.json` through nested `meta.json` files. | Page exists but has no sidebar entry. |
| P4 | Every `meta.json` entry names an existing `.mdx` or folder (`---X---` separators skipped). | Sidebar entry is silently missing. |

Each was seen failing on a scratch break (dead link, bad anchor, orphan page, page dropped from `meta.json`, dangling entry), then the tree was restored.

## Reading a result

- A violation line names the file and the bad link: fix the link, the page name or `meta.json`. That is a real bug.
- It is a **modeling error** only if the site resolves it some other way. Known gaps in the script: links in `.md`/JSX forms other than `](/docs…)`, `href="/docs…"`, `href: '/docs…'`; explicit heading ids (`## Title [#id]`); external links (not checked); `index` pages of nested folders map to the folder URL. If you add such a form, extend `re` in the script and rerun the five breaks above.
- To prove a change is caught, introduce one break, rerun, see FAIL, then `git checkout -- content src`.

## Coverage and sync

Covers: `content/docs/**/*.mdx`, every `meta.json` under `content/docs/`, and `href`/`url` strings under `src/` (today `src/app/(home)/page.tsx`).
Does not cover: external URLs, media files (use `verify-ummitos-docs`'s `media-check.sh`), rendered pages, search.

**Sync commit:** `00e2e2b` (script confirmed against the tree at this commit). If `git diff 00e2e2b --stat -- content/docs src` shows changes, run the check; once it passes and you've confirmed the script still describes the code (link syntaxes, `meta.json` shape), move this commit to the new `HEAD`.

Related known defect, not covered here: `/api/search` serves `[]` (see `verify-ummitos-docs/features/search.md`).
