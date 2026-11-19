# UmmItOS docs verification map

This directory is the maintained source for verifying the user-facing behavior of the UmmItOS docs site. Read the index before driving the app, then use the matching feature file as the recipe. Helper scripts and their invocation are in [`../SKILL.md`](../SKILL.md); `S` below is `.claude/skills/verify-ummitos-docs/scripts`, run from the repo root.

## Baseline preconditions

- Launch with `$S/launch.sh`. The site is then at `http://127.0.0.1:3100`, built into the isolated dist dir `.verify/next`.
- Run `$S/doctor.sh` and require `DOCTOR: OK`, with the build revision equal to `HEAD` (or the `+dirty` you expect).
- Network is required: `api.github.com` (Changelog data, repo card), `api.iconify.design` (icons), `youtube.com` (homepage video). If one is unreachable, report the unmet precondition.
- There is no seed data and no state to restore. The site is read-only.
- Never drive an instance this run did not start (`.verify/run/server.pid` and `port` identify it).
- Release content changes daily, so assert patterns, never a literal version or date.

## Driving conventions

- Start every recipe from a fresh `goto`; recipes do not depend on each other.
- Prefer ARIA labels and stable ids (`#nd-sidebar`, `button[data-search-full]`, `button[aria-label^="Play"]`) over CSS classes or position. The Changelog badge is the one place a class substring is the only handle.
- Treat every `drive.mjs` step as literal and quote it; `|` separates the arguments.
- Give each journey its own label. Transcripts and screenshots are named after it.
- Run interaction through `drive.mjs`, static evidence through `capture.sh` and `expect.sh`, and whole-site asset checks through `media-check.sh`.

## Proof and skip reporting

- Capture the user action and the resulting state: the `<label>.steps.txt` transcript plus a screenshot that shows the app.
- Record the feature ID and entry point in the label, for example `search-hotkey`.
- A mutation does not exist here, so the second view is a read of an independent source: `gh api` for versions, `curl -I` for assets, `git log` for last-updated.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path. A search proof that only fetches `/api/search` is not a search proof.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with drive.mjs`, `Gotchas`.

## Features

- [Changelog](./changelog.md) covers the release timeline, the Latest badge, release links, expanding full notes, and the fallback.
- [Docs navigation](./docs-navigation.md) covers the sidebar groups, the active page, previous and next links, the edit link, and the last-updated line.
- [Homepage](./homepage.md) covers the hero and version badge, the build time, the install command, the lazy video, and the path into the docs.
- [Embedded media](./embedded-media.md) covers clips and stills on feature pages, with a whole-site asset check.
- [Search](./search.md) covers opening search by button and by `/`, matching, and closing. **The matching journey currently fails.**

## Proof status when this map was created (build `bae0d23`, 2026-11-18 UTC)

| Feature | Journeys run | Result |
|---|---|---|
| Changelog | `changelog` | pass |
| Docs navigation | `nav-installation` | pass |
| Homepage | `home-hero` | pass |
| Embedded media | `media-desktop-shell`, `media-still`, `media-check.sh` | pass |
| Search | `search-hotkey` | pass |
| Search | `search-match` | **fail**, known defect (see `search.md`) |

Not driven: the Changelog fallback (needs an offline build), the empty-search state, and opening a search result. Each is marked in its feature file.
