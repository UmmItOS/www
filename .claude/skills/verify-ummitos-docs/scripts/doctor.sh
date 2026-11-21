#!/usr/bin/env bash
# Read-only. Is the verification instance worth driving?
# Exit 0 only when every FAIL-level check passes. WARN lines are informational.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 2

run=.verify/run
rc=0
ok()   { echo "ok    $*"; }
warn() { echo "WARN  $*"; }
bad()  { echo "FAIL  $*"; rc=1; }

if [[ ! -f $run/server.pid || ! -f $run/port ]]; then
  bad "no instance started by this run; run scripts/launch.sh"
  exit 1
fi
pid=$(cat "$run/server.pid")
port=$(cat "$run/port")

if kill -0 "$pid" 2>/dev/null; then ok "pid $pid is alive"; else bad "pid $pid is not running"; fi

if ss -ltnp "sport = :$port" 2>/dev/null | grep -q "pid=$pid"; then
  ok "port $port is owned by our pid"
else
  bad "port $port is not owned by pid $pid (something else answers there; do not drive it)"
fi

ok "build revision: $(cat "$run/build-rev" 2>/dev/null || echo unknown); HEAD is $(git rev-parse --short HEAD)"

if [[ -f .verify/next/BUILD_ID ]]; then
  newer=$(find src content public next.config.mjs source.config.ts package.json bun.lock tsconfig.json -type f -newer .verify/next/BUILD_ID 2>/dev/null | head -3 | tr '\n' ' ')
  if [[ -z $newer ]]; then ok "build is current with the sources"; else bad "STALE build; newer sources: $newer(relaunch with --rebuild)"; fi
else
  bad "no build output at .verify/next"
fi

base="http://127.0.0.1:$port"
for p in / /docs /docs/Installation /docs/Changelog; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "$base$p")
  if [[ $code == 200 ]]; then ok "GET $p -> 200"; else bad "GET $p -> $code"; fi
done

rem=$(curl -s --max-time 6 https://api.github.com/rate_limit | python3 -I -c 'import sys,json
try: print(json.load(sys.stdin)["resources"]["core"]["remaining"])
except Exception: print("unreachable")')
if [[ $rem == unreachable ]]; then warn "api.github.com unreachable: Changelog may show the fallback and the repo card shows no counts"; else ok "api.github.com reachable ($rem requests left this hour)"; fi

(( rc == 0 )) && echo "DOCTOR: OK" || echo "DOCTOR: FAIL"
exit $rc
