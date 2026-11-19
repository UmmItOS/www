# Docs navigation

Every docs page shares one shell: a sidebar that groups pages under INSTALL and CONFIGURE and highlights the current page, previous and next links at the bottom, a "Found an issue? Edit this page" link to the page's source on GitHub, and a "Last updated on" date taken from git.

## Sub-features

- `nav-sidebar-groups` shows the page tree with the INSTALL and CONFIGURE group labels.
- `nav-active-page` highlights the page the reader is on.
- `nav-sidebar-click` opens another page from the sidebar without a full reload.
- `nav-prev-next` links to the neighbouring pages at the bottom of the page.
- `nav-edit-link` links to the page's `.mdx` source on GitHub.
- `nav-last-updated` shows "Last updated on" with the date of the page's last commit.

## How to get to it (user POV)

- Choose `Read Documentation` on the homepage, which opens `/docs`.
- Open any `/docs/<Page>` URL directly, for example `/docs/Installation`.
- Use the sidebar links, the previous and next links, or search.

## Driving it with drive.mjs

Preconditions:

- `$S/doctor.sh` reports `DOCTOR: OK`.
- The checkout has full git history, or `nav-last-updated` shows no date.

- **Open a page.** Open `/docs/Installation`. Run `goto|/docs/Installation` then `waitfor|#nd-sidebar|8000`. The sidebar and page render.
- **Read the groups.** Run `assert-text|#nd-sidebar|Install` and `assert-text|#nd-sidebar|Configure`. Both group labels are present.
- **Read the active page.** Run `assert-count|#nd-sidebar a[href="/docs/Installation"]|==|1` and `assert-text|#nd-sidebar a[data-active="true"]|Installation`. The current page is the one active link.
- **Read previous and next.** Run `assert-count|a[href="/docs/Prerequisites"]|>=|2` and `assert-count|a[href="/docs/Post-install"]|>=|2`. Each neighbour is linked from the sidebar and from the bottom of the page.
- **Read the edit link.** Run `assert-count|a[href="https://github.com/UmmItOS/www/blob/master/content/docs/(latest)/Installation.mdx"]|==|1`. One link points at the page's source file.
- **Read last updated.** Run `assert-text|#nd-page|Last updated on`, then run `shot|page`. The date is on the page. Second view: `git log -1 --format=%cI -- content/docs/(latest)/Installation.mdx` gives the commit time it should reflect.
- **Follow a sidebar link.** Run `click|#nd-sidebar a[href="/docs/Packages"]`, `assert-url|/docs/Packages`, `assert-text|h1|Packages`, `assert-text|#nd-sidebar a[data-active="true"]|Packages`, then `shot|after-sidebar-click`. The URL, the title and the highlighted link all move to the new page.

The whole journey, as it was run:

```sh
$S/drive.mjs nav-installation \
  'goto|/docs/Installation' \
  'waitfor|#nd-sidebar|8000' \
  'assert-text|#nd-sidebar|Install' \
  'assert-text|#nd-sidebar|Configure' \
  'assert-count|#nd-sidebar a[href="/docs/Installation"]|==|1' \
  'assert-text|#nd-sidebar a[data-active="true"]|Installation' \
  'assert-count|a[href="/docs/Prerequisites"]|>=|2' \
  'assert-count|a[href="/docs/Post-install"]|>=|2' \
  'assert-count|a[href="https://github.com/UmmItOS/www/blob/master/content/docs/(latest)/Installation.mdx"]|==|1' \
  'assert-text|#nd-page|Last updated on' \
  'shot|page' \
  'click|#nd-sidebar a[href="/docs/Packages"]' \
  'assert-url|/docs/Packages' \
  'assert-text|h1|Packages' \
  'assert-text|#nd-sidebar a[data-active="true"]|Packages' \
  'shot|after-sidebar-click'
```

To cover more pages without writing a journey each, `$S/media-check.sh` already visits every sidebar page and fails if one does not respond.

## Gotchas

- The group labels render uppercase through CSS, but the text is `Install` and `Configure`. Assert the mixed-case text.
- `Installation` and `Post-install` appear three times each as links (sidebar, neighbour link, and the page's own text), so assert `>=`, not `==`, on neighbour links.
- Pages whose MDX body starts with its own `#` heading render two `h1` elements, so `h1` is only unambiguous on pages like `Packages`.
- The sidebar is the source of truth for which pages exist. A page missing from `content/docs/meta.json` renders but has no sidebar link.
- "Last updated on" depends on git history at build time. On a shallow clone the line is simply absent, which is a precondition failure, not a pass.
- The edit link is built from the file path, so a renamed or moved page changes its URL.
