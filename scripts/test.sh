#!/usr/bin/env bash
set -euo pipefail

has_script() {
  local script_name="$1"
  node -e "const s=require('./package.json').scripts||{}; process.exit(s['${script_name}']?0:1)"
}

if has_script "test"; then
  echo "Running tests..."
  npm test
  exit 0
fi

ran_any=false

if has_script "lint"; then
  echo "Running lint..."
  npm run lint
  ran_any=true
fi

if has_script "typecheck"; then
  echo "Running typecheck..."
  npm run typecheck
  ran_any=true
fi

if [ "${ran_any}" = false ]; then
  if has_script "build"; then
    echo "Running build..."
    npm run build
    exit 0
  fi

  echo "No test, lint, typecheck, or build script found."
  exit 1
fi
