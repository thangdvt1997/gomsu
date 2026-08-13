#!/usr/bin/env bash
# Pull latest code and (re)build/run the Docker stack. Meant to be run
# ON THE SERVER, from inside the repo directory (e.g. /root/test/gomsu).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> git pull"
git pull --ff-only

echo "==> docker compose build"
docker compose build

echo "==> docker compose up -d"
docker compose up -d

echo "==> status"
docker compose ps

echo "==> smoke test"
docker compose --profile test run --rm tests
