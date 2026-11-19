#!/usr/bin/env bash
# Usage: freeze-docs-version.sh vX.Y.Z
# Copies content/docs/(latest) to content/docs/vX.Y.Z, a frozen version readers pick from the sidebar dropdown.
set -euo pipefail
v=${1:?usage: freeze-docs-version.sh vX.Y.Z}
[[ $v =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "not a version: $v" >&2; exit 1; }
cd "$(git rev-parse --show-toplevel)/content/docs"
[ -d "$v" ] && { echo "$v already exists" >&2; exit 1; }

cp -r '(latest)' "$v"
rm -f "$v/Changelog.mdx"
# The Changelog is shared and lives only in (latest), so links to it stay unversioned.
find "$v" -name '*.mdx' -exec sed -i -E "s#(\]\(|href=[\"'])/docs(/|[\"')\#])#\1/docs/$v\2#g; s#/docs/$v/Changelog#/docs/Changelog#g" {} +

node -e '
const fs = require("fs"), v = process.argv[1];
const m = JSON.parse(fs.readFileSync(`${v}/meta.json`));
Object.assign(m, { title: v, description: "Older version", root: true });
m.pages = m.pages.filter((p) => p !== "Changelog");
fs.writeFileSync(`${v}/meta.json`, JSON.stringify(m, null, 2) + "\n");
const r = JSON.parse(fs.readFileSync("meta.json"));
r.pages.splice(r.pages.indexOf("(latest)") + 1, 0, v);
fs.writeFileSync("meta.json", JSON.stringify(r, null, 2) + "\n");
' "$v"
echo "froze (latest) as content/docs/$v"
