#!/usr/bin/env bash
# Build an isolated copy of the site and serve it on 127.0.0.1 for verification.
# Usage: launch.sh [--port 3100] [--rebuild]
# Own dist dir (.verify/next) and own port, so it never touches the user's
# .next or a dev server on :3000. State lives in .verify/run, proof in .verify/evidence.
set -euo pipefail

root=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
cd "$root"

port=3100
rebuild=0
while [[ $# -gt 0 ]]; do
  case $1 in
    --port) port=$2; shift 2 ;;
    --rebuild) rebuild=1; shift ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

run=.verify/run
mkdir -p "$run" .verify/evidence

if [[ -f $run/server.pid ]] && kill -0 "$(cat "$run/server.pid")" 2>/dev/null; then
  echo "already running: pid $(cat "$run/server.pid") on port $(cat "$run/port"); run cleanup.sh first to restart"
  exit 0
fi
if ss -ltn 2>/dev/null | grep -q ":$port "; then
  echo "port $port is in use by a process this run did not start; pick another with --port" >&2
  exit 1
fi
[[ -f node_modules/next/dist/bin/next ]] || { echo "dependencies missing: run bun install" >&2; exit 1; }

export NEXT_DIST_DIR=.verify/next
export NODE_OPTIONS=--no-deprecation
next="node node_modules/next/dist/bin/next"

# Rebuild when forced, missing, or older than any source the site is built from.
stale=0
if [[ ! -f .verify/next/BUILD_ID ]]; then
  stale=1
elif [[ -n $(find src content public next.config.mjs source.config.ts package.json bun.lock tsconfig.json -type f -newer .verify/next/BUILD_ID 2>/dev/null | head -1) ]]; then
  stale=1
fi
if (( rebuild || stale )); then
  echo "building (isolated dist .verify/next) ..."
  # A custom distDir makes `next build` add .verify/next/types to the tracked
  # tsconfig.json. Snapshot it (mtime included) and put it back, so a
  # verification run never leaves a dirty working tree.
  cp -p tsconfig.json "$run/tsconfig.json.orig"
  restore_tsconfig() { cp -p "$run/tsconfig.json.orig" tsconfig.json; }
  trap restore_tsconfig EXIT
  $next build > "$run/build.log" 2>&1 || { tail -25 "$run/build.log" >&2; echo "build failed" >&2; exit 1; }
  restore_tsconfig
  trap - EXIT
fi

rev=$(git rev-parse --short HEAD)
[[ -n $(git status --porcelain -- src content public next.config.mjs 2>/dev/null) ]] && rev="$rev+dirty"
echo "$rev" > "$run/build-rev"

run_id=$(date -u +%Y%m%dT%H%M%SZ)
echo "$run_id" > "$run/run-id"
mkdir -p ".verify/evidence/$run_id"
echo "$port" > "$run/port"

# New session so cleanup can signal the whole process group. exec keeps the pid.
setsid sh -c "echo \$\$ > $run/server.pid; exec $next start -p $port -H 127.0.0.1" > "$run/server.log" 2>&1 &

for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:$port/" 2>/dev/null; then
    echo "ready http://127.0.0.1:$port rev=$rev run=$run_id"
    exit 0
  fi
  sleep 1
done
echo "server did not become ready in 60s" >&2
tail -20 "$run/server.log" >&2
exit 1
