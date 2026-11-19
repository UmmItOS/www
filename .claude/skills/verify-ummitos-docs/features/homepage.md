# Homepage

The homepage introduces UmmItOS: a hero with the current release version and "Since 2023", a terminal preview, the one-command install, a lazy-loaded demo video, and a clear path into the docs. The top of the page shows when the site was last built.

## Sub-features

- `home-hero` shows the headline "Built for power users" and the "Since 2023" badge.
- `home-version` shows the latest GitHub release in the hero badge.
- `home-built` shows a "Last built" timestamp at the top right.
- `home-install` shows the one-command install using the `HEAD/setup.sh` URL.
- `home-video` shows a poster with a play button, and loads the YouTube player only after a click.
- `home-docs-cta` opens the docs from the `Read Documentation` button.

## How to get to it (user POV)

- Open `/`.
- Choose the `UmmItOS` logo in the navigation from any page.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK` and `api.github.com reachable`.
- `latest=$(gh api repos/UmmItOS/UmmItOS/releases/latest --jq .tag_name)` has been run, for the second view of the version.

- **Open the page.** Open `/`. Run `goto|/` then `waitfor|h1|8000`. The hero renders.
- **Read the hero.** Run `assert-text|h1|Built for power users` and `assert-text|main|Since 2023`. The headline and the badge are present.
- **Read the version.** Run `"assert-text|span.text-green-400|$latest"`. The badge shows the same tag as the independent `gh api` read.
- **Read the build time.** Run `assert-text|main > div:first-child|Last built`. The top-right line is present.
- **Read the install command.** Run `assert-text|main|UmmItOS/HEAD/setup.sh`. The one-command install uses the `HEAD` URL.
- **Check the video before play.** Run `assert-count|button[aria-label^="Play"]|==|1` and `assert-count|iframe[src^="https://www.youtube.com/embed/"]|==|0`. A play button is shown and no player is loaded yet.
- **Play the video.** Run `click|button[aria-label^="Play"]`, `waitfor|iframe[src^="https://www.youtube.com/embed/"]|5000`, then `shot|video-loaded`. The player iframe replaces the poster.
- **Enter the docs.** Run `goto|/`, `click-text|a[href="/docs"]|Read Documentation`, `assert-url|/docs`, `waitfor|#nd-sidebar|8000`, then `shot|after-cta`. The reader lands in the docs shell.

The whole journey, as it was run:

```sh
latest=$(gh api repos/UmmItOS/UmmItOS/releases/latest --jq .tag_name)
$S/drive.mjs home-hero \
  'goto|/' \
  'waitfor|h1|8000' \
  'assert-text|h1|Built for power users' \
  'assert-text|main|Since 2023' \
  "assert-text|span.text-green-400|$latest" \
  'assert-text|main > div:first-child|Last built' \
  'assert-text|main|UmmItOS/HEAD/setup.sh' \
  'assert-count|button[aria-label^="Play"]|==|1' \
  'assert-count|iframe[src^="https://www.youtube.com/embed/"]|==|0' \
  'click|button[aria-label^="Play"]' \
  'waitfor|iframe[src^="https://www.youtube.com/embed/"]|5000' \
  'shot|video-loaded' \
  'goto|/' \
  'click-text|a[href="/docs"]|Read Documentation' \
  'assert-url|/docs' \
  'waitfor|#nd-sidebar|8000' \
  'shot|after-cta'
```

Format of the timestamp, which the DOM splits with a comment node: `$S/capture.sh / home-static --no-shot` then `$S/expect.sh .verify/evidence/<run-id>/home-static.dom.html '~Last built (<!-- -->)?[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2} UTC'`.

## Gotchas

- Two links point at `/docs`. `click|a[href="/docs"]` takes the first in the page, so use `click-text` with `Read Documentation` for the hero button.
- The version also appears in the terminal preview (`UmmItOS v…`). `span.text-green-400` targets the hero badge only.
- The version is the latest release **at build time**. If a release was published after the build, the badge and the `gh api` read differ until a rebuild (`launch.sh --rebuild`). Treat a mismatch as stale-build first, not as a bug.
- `Last built` is the time of the isolated build, so it is not production's time. The DOM text is `Last built <!-- -->2026-…`, with a comment node, so assert `Last built` and the timestamp separately.
- The video thumbnail comes from `img.youtube.com`. Offline, the poster is empty but the play button and iframe logic still work.
- The page shows a Next.js dev badge only in development; this skill runs the production build.
