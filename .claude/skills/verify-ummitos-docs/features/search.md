# Search

The site has a search dialog, opened from the navbar search button or by pressing `/`. Typing shows matching pages, and `Escape` closes it.

## Sub-features

- `search-hotkey` opens the dialog with `/` and closes it with `Escape`. **Passes.**
- `search-match` shows results for a typed query such as `install`. **Passes.**
- `search-open-result` opens a result. **Passes.**
- `search-empty` shows "No results found" for a query with no match. **Passes.**

## How to get to it (user POV)

- Choose the search button in the navbar of any page.
- Press `/` anywhere.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK`.

- **Hotkey.** Run `goto|/docs`, `waitfor|#nd-sidebar|8000`, `press|/`, `waitfor|input[role="combobox"][aria-label="Search"]|3000`, `shot|open`, `press|Escape`, `assert-count|input[role="combobox"][aria-label="Search"]|==|0`.
- **Matching.** Run `goto|/docs`, `click|button[data-search-full]`, `waitfor|input[role="combobox"][aria-label="Search"]|3000`, `type|install`, `sleep|1500`, `assert-count|#fd-search-list [role="option"]|>=|1`, then `shot|results`. The first option is v1.6.0 Installation.
- **Open a result.** As above, then `click|#fd-search-list [role="option"]` and `assert-url|/docs/Installation`.
- **Empty.** As above with `type|zzqxjvw`, then `assert-count|#fd-search-list [role="option"]|==|0` and `assert-text|#fd-search-list|No results found`.

Recorded runs: all four passed (run `20261120T055719Z`), with evidence in `.verify/evidence/<run-id>/`.

## Gotchas

- **Static index.** The layout uses `type: 'static'`, so the client downloads the whole index from `/api/search`. `route.ts` must export `staticGET` as `GET`. The dynamic `GET` returns `[]` without a `query`, which is what broke search until 2026-11-20. A 2-byte `/api/search` means this regressed.
- Results include frozen versions too, so `install` also matches v1.5.0 pages. The current version ranks first.
- Fetching `/api/search` is not a search proof. Always type into the dialog.
- The dialog input is created on open, so `waitfor` it after the click or key press.
