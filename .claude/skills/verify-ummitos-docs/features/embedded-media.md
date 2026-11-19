# Embedded media

Feature pages carry short looping clips and still screenshots that show what the page describes, each with a caption. Clips autoplay muted and loop; stills are images.

## Sub-features

- `media-clips` shows autoplaying, muted, looping `video` clips with captions (Desktop Shell has 5).
- `media-still` shows a captioned screenshot, for example `/docs-post-install.png` on Post-install.
- `media-served` means every image and video the pages reference is actually served.

## How to get to it (user POV)

- Open `/docs/configuration/quickshell` (clips) or `/docs/Post-install` (still).
- Scroll any docs page that has a figure.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK`.

- **Clips.** Run `goto|/docs/configuration/quickshell`, `waitfor|video|8000`, `assert-count|video[autoplay][muted][loop][playsinline]|==|5`, `assert-count|figure figcaption|>=|5`, `assert-js|[...document.querySelectorAll('video')].every(v => v.readyState >= 2)`, then `shot|clips`.
- **Still.** Run `goto|/docs/Post-install`, `waitfor|figure img|8000`, `assert-js|document.querySelector('figure img').naturalWidth > 0`, then `shot|still`.
- **Whole site.** Run `$S/media-check.sh`. It reads the sidebar, extracts every local `src`/`poster`, and requires HTTP 200, non-zero size and a correct content type. It fails when it finds zero assets.

The journeys, as they were run (labels `media-desktop-shell`, `media-still`): the two drive recipes above, plus `media-check.sh` (42 asset references across 20 pages, all served).

## Gotchas

- Clips autoplay, so a screenshot shows a mid-clip frame. Prove clips by markup, served assets and `readyState`, not by a visual match.
- The clip count changes when clips are added. Use `>=` when a page gains clips; `==5` is today's Desktop Shell page.
- A just-loaded video may still be at `readyState` 1. If the decode check fails, `sleep|1500` and retry before calling it a defect.
- `media-check.sh` only sees assets in server-rendered HTML, not ones added by client scripts.
