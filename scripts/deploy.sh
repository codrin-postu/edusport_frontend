#!/usr/bin/env bash
# Idempotent deploy script for the Next.js frontend.
# Run on the VM:  cd /opt/edusport/edusport_frontend && ./scripts/deploy.sh
set -euo pipefail

# Resolve the repo root regardless of caller cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
SERVICE="frontend"

# docker compose only auto-reads `.env` (no suffix). Our secrets live in
# `.env.production`, so every invocation must pass --env-file explicitly,
# otherwise the ${VAR} substitutions in the compose file resolve to empty
# strings and NEXT_PUBLIC_* values vanish at build time.
COMPOSE=(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}")

banner() {
  printf '\n========== %s ==========\n' "$1"
}

banner "Fetching latest main"
git fetch --prune
git reset --hard origin/main

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} is missing. Copy .env.example and fill it in." >&2
  exit 1
fi

# Inject the current git SHA so /api/health can report it.
COMMIT_SHA="$(git rev-parse --short HEAD)"
export NEXT_PUBLIC_COMMIT_SHA="${COMMIT_SHA}"

banner "Building image (sha=${COMMIT_SHA})"
"${COMPOSE[@]}" build \
  --build-arg NEXT_PUBLIC_COMMIT_SHA="${COMMIT_SHA}" \
  "${SERVICE}"

banner "Starting service"
"${COMPOSE[@]}" up -d "${SERVICE}"

banner "Waiting for health check (10s grace period)"
sleep 10
if ! "${COMPOSE[@]}" exec -T "${SERVICE}" \
    wget -qO- http://localhost:3000/api/health >/dev/null; then
  echo "ERROR: health check failed. Recent logs:" >&2
  "${COMPOSE[@]}" logs --tail=80 "${SERVICE}" >&2
  exit 1
fi
echo "Health check OK."

banner "Pruning dangling images"
docker image prune -f >/dev/null

banner "Container status"
"${COMPOSE[@]}" ps
