#!/usr/bin/env bash
# Assertions over a captured DOM file. Exit 1 if any assertion fails.
# Usage: expect.sh <file.dom.html> <needle> [<needle>...]
#   text       fixed string that must appear
#   !text      fixed string that must NOT appear
#   ~regex     extended regex that must match   (versions, timestamps)
#   !~regex    extended regex that must NOT match
# Results print and are saved next to the DOM as <file>.expect.txt (proof).
set -uo pipefail

f=${1:?usage: expect.sh <file.dom.html> <needle|!needle|~regex>...}
shift
[[ -f $f ]] || { echo "no such file: $f" >&2; exit 2; }

{
  rc=0
  for n in "$@"; do
    neg=0
    [[ $n == '!'* ]] && { neg=1; n=${n#!}; }
    if [[ $n == '~'* ]]; then
      pat=${n#\~}; grep -qE -- "$pat" "$f"; hit=$?; kind="regex"
    else
      pat=$n; grep -qF -- "$pat" "$f"; hit=$?; kind="text"
    fi
    found=$(( hit == 0 ))
    if (( neg )); then
      (( found )) && { echo "FAIL present, must be absent ($kind): $pat"; rc=1; } || echo "PASS absent ($kind): $pat"
    else
      (( found )) && echo "PASS found ($kind): $pat" || { echo "FAIL missing ($kind): $pat"; rc=1; }
    fi
  done
  exit $rc
} | tee "${f%.dom.html}.expect.txt"
exit "${PIPESTATUS[0]}"
