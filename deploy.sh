#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker/docker-compose.yml"
ACTION="${1:-deploy}"

if [[ "$#" -gt 1 ]] || [[ "$ACTION" != "deploy" && "$ACTION" != "build" ]]; then
    printf 'Usage: %s [deploy|build]\n' "$0" >&2
    exit 2
fi

if ! command -v podman >/dev/null 2>&1; then
    printf 'Error: podman is required.\n' >&2
    exit 1
fi

if command -v podman-compose >/dev/null 2>&1; then
    COMPOSE=(podman-compose -f "$COMPOSE_FILE")
elif podman compose --help >/dev/null 2>&1; then
    COMPOSE=(podman compose -f "$COMPOSE_FILE")
else
    printf 'Error: install podman-compose or enable the podman compose provider.\n' >&2
    exit 1
fi

"${COMPOSE[@]}" up -d deno

"${COMPOSE[@]}" exec -T deno deno run --allow-all /app/web/private/build.ts

if [[ "$ACTION" == "deploy" ]]; then
    "${COMPOSE[@]}" restart deno
fi
