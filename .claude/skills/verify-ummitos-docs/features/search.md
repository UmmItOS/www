# Search

The site has a search dialog, opened from the navbar search button or by pressing `/`. Typing shows matching pages, and `Escape` closes it.

## Sub-features

- `search-hotkey` opens the dialog with `/` and closes it with `Escape`. **Passes.**
- `search-match` shows results for a typed query such as `install`. **Fails (known defect).**
- `search-open-result` opens a result. **Not driven**, because there are no results to open.
- `search-empty` shows the empty state for a query with no match. **Not driven.**

## How to get to it (user POV)

- Choose the search button in the navbar of any page.
- Press `/` anywhere.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK`.

- **Hotkey.** Run `goto|/docs`, `waitfor|#nd-sidebar|8000`, `press|/`, `waitfor|input[role="combobox"][aria-label="Search"]|3000`, `shot|open`, `press|Escape`, `assert-count|input[role="combobox"][aria-label="Search"]|==|0`.
- **Matching.** Run `goto|/docs`, `click|button[data-search-full]`, `waitfor|input[role="combobox"][aria-label="Search"]|3000`, `type|install`, `sleep|1500`, `assert-count|#fd-search-list [role="option"]|>=|1`, then `shot|results`. Today this fails: the list stays `hidden` and has no options. The option selector is unverified, because no result has ever rendered.

Recorded runs: `search-hotkey` passed, `search-match` failed, with evidence in `.verify/evidence/<run-id>/`.

## Gotchas

- **Known defect.** `/api/search` returns `[]` (2 bytes), locally and on `https://docs.ummit.dev/api/search`. `src/app/api/search/route.ts` exports the dynamic `GET` under `force-static`, but the layout configures `RootProvider search={{ options: { type: 'static' } }}`, which fetches the index from a route that exports `staticGET`. Likely fix: `export const { staticGET: GET } = createFromSource(source)` and adjust `force-static`. Never weaken `search-match` to pass; fix the app, then update this file.
- Fetching `/api/search` is not a search proof. Always type into the dialog.
- The dialog input is created on open, so `waitfor` it after the click or key press.
