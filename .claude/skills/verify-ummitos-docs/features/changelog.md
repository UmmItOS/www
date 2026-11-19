# Changelog

The Changelog page lists every tagged GitHub release of UmmItOS, newest first. Each release shows its tag, its date, a one-line summary, and a collapsible with the full release notes. The newest release carries a Latest badge.

## Sub-features

- `changelog-list` shows one entry per GitHub release, each with a "Show full notes" control.
- `changelog-latest` marks the newest release with a Latest badge.
- `changelog-links` links each tag to its GitHub release page.
- `changelog-expand` opens and closes the full notes of a release.
- `changelog-fallback` shows a "view them on GitHub" message when no release data could be loaded.

## How to get to it (user POV)

- Choose `Changelog` in the docs sidebar, directly under `Overview`.
- Open `/docs/Changelog`. The homepage does not link to it.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK` and `api.github.com reachable`. The release data is fetched when the site is **built**, so a build made offline shows the fallback.
- The repository has at least 20 releases (25 at the time of writing).

- **Open the page.** Open `/docs/Changelog`. Run `goto|/docs/Changelog` then `waitfor|details|10000`. A timeline of releases renders.
- **Count the releases.** Run `assert-count|details|>=|20` and `assert-count|a[href^="https://github.com/UmmItOS/UmmItOS/releases/tag/"]|>=|20`. Every release has an expand control and a release link.
- **Read the Latest badge.** Run `assert-text|section span[class*="px-2.5"]|Latest`. The first release carries the badge.
- **Expand the notes.** Run `assert-count|details[open]|==|0`, `click|details > summary`, then `assert-count|details[open]|==|1` and `assert-count|details[open] li|>=|1`. The first release opens and shows bulleted notes. Run `shot|expanded`.
- **Collapse the notes.** Run `click|details[open] > summary` then `assert-count|details[open]|==|0`. The notes close. Run `shot|collapsed`.
- **Second view.** Compare the tag shown first with `gh api repos/UmmItOS/UmmItOS/releases/latest --jq .tag_name`, and read the expanded screenshot for the same tag and the "Hide full notes" label.

The whole journey, as it was run:

```sh
$S/drive.mjs changelog \
  'goto|/docs/Changelog' \
  'waitfor|details|10000' \
  'assert-count|details|>=|20' \
  'assert-count|a[href^="https://github.com/UmmItOS/UmmItOS/releases/tag/"]|>=|20' \
  'assert-text|section span[class*="px-2.5"]|Latest' \
  'assert-count|details[open]|==|0' \
  'click|details > summary' \
  'assert-count|details[open]|==|1' \
  'assert-count|details[open] li|>=|1' \
  'shot|expanded' \
  'click|details[open] > summary' \
  'assert-count|details[open]|==|0' \
  'shot|collapsed'
```

Static evidence, no clicks needed: `$S/capture.sh /docs/Changelog changelog-static --no-shot` then `$S/expect.sh .verify/evidence/<run-id>/changelog-static.dom.html 'Every tagged release' '>Latest<' '~releases/tag/v[0-9]+\.[0-9]+\.[0-9]+' '!load releases right now'`.

`changelog-fallback` is **not driven**: it needs a build made with `api.github.com` unreachable. If you can produce that build, expect the text `load releases right now` and a link to `https://github.com/UmmItOS/UmmItOS/releases`.

## Gotchas

- `section span.rounded-full` matches the empty timeline **dot** first, not the badge. Use `span[class*="px-2.5"]`.
- Versions, dates and counts change with every release. Assert `>=` counts and `~v[0-9]+\.[0-9]+\.[0-9]+` patterns, never a literal tag. The badge is on whichever release is newest.
- A release with an empty body has no expand control, so the number of `details` can be below the number of tags. Today every release has notes.
- The page shows what the **build** fetched. A release published after the build does not appear until a rebuild (`launch.sh --rebuild`), and in production the page revalidates hourly.
- Unauthenticated GitHub allows 60 requests an hour. Repeated rebuilds can exhaust it and produce the fallback; `doctor.sh` prints the remaining count.
