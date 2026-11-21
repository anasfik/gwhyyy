#!/usr/bin/env sh
set -eu
TOKEN=$(grep '^DASHBOARD_API_TOKEN=' /home/gw/apps/gwhyyy/.env.production | cut -d= -f2-)
[ -n "$TOKEN" ] || { echo "DASHBOARD_API_TOKEN missing" >&2; exit 1; }
GWHYYY_ADMIN_TOKEN="$TOKEN" GWHYYY_BASE_URL="${GWHYYY_BASE_URL:-https://gwhyyy.com}" \
  exec node /home/gw/apps/gwhyyy/mcp/gwhyyy-server.mjs
