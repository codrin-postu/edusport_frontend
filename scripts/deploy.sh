#!/usr/bin/env bash
# Idempotent deploy script for the Next.js frontend.
# Run on the VM:  cd /opt/edusport/edusport_frontend && ./scripts/deploy.sh [phase]
#
# Phases (run individually so CI can track each step, or `all` for a full run):
#   pull    fetch + hard-reset to origin/${DEPLOY_REF:-main}
#   build   docker compose build (bakes NEXT_PUBLIC_* + commit SHA)
#   up      docker compose up -d
#   health  wait for /api/health, prune dangling images, print status
#   all     pull -> build -> up -> health   (default)
set -euo pipefail

# Resolve the repo root regardless of caller cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
SERVICE="frontend"
DEPLOY_REF="${DEPLOY_REF:-main}"

# docker compose only auto-reads `.env` (no suffix). Our secrets live in
# `.env.production`, so every invocation must pass --env-file explicitly,
# otherwise the ${VAR} substitutions in the compose file resolve to empty
# strings and NEXT_PUBLIC_* values vanish at build time.
COMPOSE=(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}")

banner() {
  printf '\n========== %s ==========\n' "$1"
}

require_env() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "ERROR: ${ENV_FILE} is missing. Copy .env.example and fill it in." >&2
    exit 1
  fi
}

phase_pull() {
  banner "Fetching origin/${DEPLOY_REF}"
  git fetch --prune
  git reset --hard "origin/${DEPLOY_REF}"
}

phase_build() {
  require_env
  # Inject the current git SHA so /api/health can report it.
  local commit_sha
  commit_sha="$(git rev-parse --short HEAD)"
  export NEXT_PUBLIC_COMMIT_SHA="${commit_sha}"
  banner "Building image (sha=${commit_sha})"
  "${COMPOSE[@]}" build \
    --build-arg NEXT_PUBLIC_COMMIT_SHA="${commit_sha}" \
    "${SERVICE}"
}

phase_up() {
  require_env
  banner "Starting service"
  "${COMPOSE[@]}" up -d "${SERVICE}"
}

phase_health() {
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
}

case "${1:-all}" in
  pull)   phase_pull ;;
  build)  phase_build ;;
  up)     phase_up ;;
  health) phase_health ;;
  all)    phase_pull; phase_build; phase_up; phase_health ;;
  *)      echo "usage: $0 [pull|build|up|health|all]" >&2; exit 2 ;;
esac
