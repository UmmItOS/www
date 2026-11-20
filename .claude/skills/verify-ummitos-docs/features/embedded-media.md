# Embedded media

Feature pages carry short looping clips and still screenshots that show what the page describes, each with a caption. Clips are muted and loop, start only when scrolled into view, pause when they leave, and have a player bar (play/pause, seek, time); stills are images.

## Sub-features

- `media-clips` shows muted, looping `video` clips with captions (Desktop Shell has 9).
- `media-scroll-play` plays a clip only while it is in view, and a clip the reader paused stays paused.
- `media-player-bar` pauses, resumes and seeks a clip, and shows `m:ss / m:ss`.
- `media-still` shows a captioned screenshot, for example `/docs-post-install.png` on Post-install.
- `media-served` means every image and video the pages reference is actually served.

## How to get to it (user POV)

- Open `/docs/configuration/quickshell` (clips) or `/docs/Post-install` (still).
- Scroll any docs page that has a figure.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK`.

- **Clips.** Run `goto|/docs/configuration/quickshell`, `waitfor|video|8000`, `assert-count|figure[data-clip] video[muted][loop][playsinline]|==|9`, `assert-count|video[autoplay]|==|0`, `assert-count|figure figcaption|>=|5`, `assert-js|[...document.querySelectorAll('video')].every(v => v.readyState >= 1)` (metadata only: clips not yet scrolled to stay at 1), then `shot|clips`.
- **Still.** Run `goto|/docs/Post-install`, `waitfor|figure img|8000`, `assert-js|document.querySelector('figure img').naturalWidth > 0`, then `shot|still`.
- **Scroll play and player bar.** With `V='document.querySelectorAll("figure[data-clip] video")'` and `F='document.querySelectorAll("figure[data-clip]")[4]'` (in zsh write `${V}[4]`, since `$V[4]` is a character of the string): `goto|/docs/configuration/quickshell`, `sleep|3000`, assert every clip below the fold is `paused && currentTime===0`; scroll clip 4 into view, `sleep|3000`, assert `currentTime>1 && !paused`; click `${F}.querySelector('button')`, assert paused and `aria-label` is `Play clip`; scroll away and back, assert still paused; set the `input[type=range]` value to 2 with the native setter and dispatch `input`, assert `currentTime` is about 2; click the button again, assert playing. Also assert no `span.tabular-nums` ends in `/ 0:00`.
- **Whole site.** Run `$S/media-check.sh`. It reads the sidebar, extracts every local `src`/`poster`, and requires HTTP 200, non-zero size and a correct content type. It fails when it finds zero assets.

The journeys, as they were run (labels `media-desktop-shell`, `media-still`): the two drive recipes above, plus `media-check.sh` (42 asset references across 20 pages, all served).

## Gotchas

- Clips in view play, so a screenshot shows a mid-clip frame. Prove clips by markup, served assets and `readyState`, not by a visual match.
- The clip count changes when clips are added. Use `>=` when a page gains clips; `==9` is the Desktop Shell page at v1.6.0.
- Clips below the fold never start (the component plays on scroll), so `currentTime` stays at 0 until scrolled in. To prove a clip plays, scroll it in first: `assert-js|(document.querySelector('video[poster="/<name>-poster.jpg"]').scrollIntoView({block:'center'}),true)`, `sleep|3000`, then `assert-js|` on `currentTime>1 && !paused`.
- A just-loaded video may still be at `readyState` 0. If the metadata check fails, `sleep|1500` and retry before calling it a defect.
- A clip whose metadata loaded before hydration showed `0:00 / 0:00` until the component read the video once on mount. A `/ 0:00` readout means that regressed.
- `media-check.sh` only sees assets in server-rendered HTML, not ones added by client scripts.
