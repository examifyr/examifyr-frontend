#!/usr/bin/env bash
set -euo pipefail

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Checking for existing process on port 3000..."
pids="$(lsof -ti tcp:3000 || true)"
if [ -n "${pids}" ]; then
  echo "Killing process(es) on port 3000: ${pids}"
  if ! echo "${pids}" | xargs kill -9 2>/dev/null; then
    kill -9 ${pids} || true
  fi
fi

echo "Starting frontend..."
echo "Frontend running at http://localhost:3000"
exec npm run dev -- --port 3000
