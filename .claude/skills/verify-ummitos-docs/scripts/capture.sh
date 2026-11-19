#!/usr/bin/env bash
# Capture proof of one page from the instance this run started.
# Usage: capture.sh <path> <label> [--size 1500x2000] [--budget 5000] [--no-shot] [--no-dom]
#   <path>   site path, e.g. /docs/Changelog
#   <label>  file stem for the artifacts, e.g. changelog-top
# Writes <label>.dom.html (DOM after scripts ran) and <label>.png into
# .verify/evidence/<run-id>/ and appends a line to that folder's INDEX.tsv.
# --budget is the virtual time (ms) Chromium lets client fetches and the
# Iconify icon requests finish; raise it for pages that call api.github.com.
set -euo pipefail
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

path=${1:?usage: capture.sh <path> <label> [options]}
label=${2:?usage: capture.sh <path> <label> [options]}
shift 2

size=1500x2000
budget=5000
shot=1
dom=1
while [[ $# -gt 0 ]]; do
  case $1 in
    --size) size=$2; shift 2 ;;
    --budget) budget=$2; shift 2 ;;
    --no-shot) shot=0; shift ;;
    --no-dom) dom=0; shift ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -f .verify/run/port && -f .verify/run/run-id ]] || { echo "no instance: run scripts/launch.sh" >&2; exit 1; }
port=$(cat .verify/run/port)
out=.verify/evidence/$(cat .verify/run/run-id)
mkdir -p "$out"
url="http://127.0.0.1:$port$path"
common=(--headless --disable-gpu --hide-scrollbars "--user-data-dir=$PWD/.verify/run/chrome-profile" "--virtual-time-budget=$budget")

if (( dom )); then
  chromium "${common[@]}" --dump-dom "$url" > "$out/$label.dom.html" 2>/dev/null
  echo "$out/$label.dom.html"
fi
if (( shot )); then
  chromium "${common[@]}" "--window-size=${size/x/,}" "--screenshot=$PWD/$out/$label.png" "$url" > /dev/null 2>&1
  echo "$out/$label.png"
fi
printf '%s\t%s\t%s\t%s\n' "$label" "$path" "$(date -u +%FT%TZ)" "$(cat .verify/run/build-rev)" >> "$out/INDEX.tsv"
