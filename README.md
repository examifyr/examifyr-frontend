# Examifyr Frontend

Next.js/React frontend for Examifyr.

## Prereqs

- Node.js 18+ (LTS recommended)
- npm

## Install

```bash
npm install
```

## Start locally

```bash
./start-local.sh
```

This script ensures dependencies are installed, kills anything on port 3000, and starts the dev server at http://localhost:3000.

## Run tests (Step 2.3)

```bash
./scripts/test.sh
```

This runs `npm test` when available, otherwise falls back to lint/typecheck/build.

## Environment variables

Create `.env.local` if you need to override defaults:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

`NEXT_PUBLIC_API_BASE_URL` points to the backend API (default should be http://127.0.0.1:8000).

## Troubleshooting

- Port 3000 in use: `./start-local.sh` will kill existing processes on port 3000.
- Backend not running: ensure the backend is up at `NEXT_PUBLIC_API_BASE_URL` or the health/version calls will fail.
