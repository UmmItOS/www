#!/usr/bin/env bash
# Every local image/video referenced by any page must be served: HTTP 200,
# non-empty, and the right content type. Reads server-rendered HTML, so no
# browser is needed. Pages come from the links in the /docs sidebar.
# Usage: media-check.sh        (exit 1 if any asset is missing, empty or mistyped)
# Output is also saved to .verify/evidence/<run-id>/media-check.txt.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 2
[[ -f .verify/run/port && -f .verify/run/run-id ]] || { echo "no instance: run scripts/launch.sh" >&2; exit 1; }

base=${VERIFY_BASE:-"http://127.0.0.1:$(cat .verify/run/port)"}   # VERIFY_BASE is only for testing this script
out=".verify/evidence/$(cat .verify/run/run-id)/media-check.txt"
mkdir -p "$(dirname "$out")"

pages=$({ echo /; echo /docs; curl -s --max-time 10 "$base/docs" | grep -oE 'href="/docs[^"#?]*"' | sed -E 's/^href="//; s/"$//'; } | sort -u)

{
  fail=0
  n=0
  for p in $pages; do
    html=$(curl -s --max-time 15 "$base$p")
    while read -r asset; do
      [[ -z $asset ]] && continue
      read -r code size type < <(curl -s -o /dev/null -w '%{http_code} %{size_download} %{content_type}\n' --max-time 30 "$base$asset")
      n=$((n + 1))
      case $asset in
        *.mp4) want=video/mp4 ;;
        *.webm) want=video/webm ;;
        *.jpg | *.jpeg) want=image/jpeg ;;
        *.png) want=image/png ;;
        *.svg) want=image/svg ;;
        *) want= ;;
      esac
      if [[ $code == 200 && $size -gt 0 && ( -z $want || $type == $want* ) ]]; then
        echo "ok   $p  $asset  ${size}B"
      else
        echo "FAIL $p  $asset  code=$code size=$size type=$type (wanted ${want:-any})"
        fail=1
      fi
    done < <(grep -oE '(src|poster)="/[^"]+\.(mp4|webm|jpe?g|png|svg|webp)"' <<< "$html" | sed -E 's/^[a-z]+="//; s/"$//' | sort -u)
  done
  echo "checked $n asset references across $(wc -w <<< "$pages") pages"
  # Finding nothing is a failure, not a pass: it means the server is down or the pages changed shape.
  (( n == 0 )) && { echo "FAIL found no asset references to check"; fail=1; }
  (( fail )) && echo "MEDIA: FAIL" || echo "MEDIA: OK"
  exit $fail
} | tee "$out"
exit "${PIPESTATUS[0]}"
