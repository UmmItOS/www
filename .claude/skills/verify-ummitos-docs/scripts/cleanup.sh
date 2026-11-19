#!/usr/bin/env bash
# Stop the instance this run started and remove scratch state.
# Never kills by name: only the pid recorded by launch.sh. Never touches
# .verify/evidence. The isolated build (.verify/next) is kept so the next
# launch is fast; pass --purge to delete it too.
# Usage: cleanup.sh [--purge]
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 2

run=.verify/run
pid=$(cat "$run/server.pid" 2>/dev/null || true)
port=$(cat "$run/port" 2>/dev/null || true)

if [[ -n $pid ]] && kill -0 "$pid" 2>/dev/null; then
  kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null
  for _ in $(seq 1 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
  if kill -0 "$pid" 2>/dev/null; then kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null; fi
fi

# Keep the server log with the proof, then drop run state.
if [[ -f $run/run-id && -f $run/server.log ]]; then
  cp "$run/server.log" ".verify/evidence/$(cat "$run/run-id")/server.log" 2>/dev/null || true
fi
rm -rf "$run/server.pid" "$run/port" "$run/run-id" "$run/build-rev" "$run/tsconfig.json.orig" "$run"/chrome-profile*
[[ ${1:-} == --purge ]] && rm -rf .verify/next

if [[ -n $port ]] && ss -ltn 2>/dev/null | grep -q ":$port "; then
  echo "WARN: port $port is still listening; it is not ours to kill" >&2
  exit 1
fi
echo "cleaned up (evidence kept in .verify/evidence)"
