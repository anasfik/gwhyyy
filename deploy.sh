#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy.sh — Deploy gwhyyy.com portfolio to a VPS
#
# Usage:
#   ./deploy.sh [VPS_USER@VPS_IP] [REMOTE_DIR]
#
# Example:
#   ./deploy.sh root@123.45.67.89 /opt/gwhyyy
#
# Prerequisites on VPS:
#   - Docker + Docker Compose v2 installed
#   - SSH key auth configured
# ─────────────────────────────────────────────────────────────

set -euo pipefail

VPS="${1:-}"
REMOTE_DIR="${2:-/opt/gwhyyy}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Validate ──────────────────────────────────────────────────
if [[ -z "$VPS" ]]; then
  echo "Usage: ./deploy.sh user@vps-ip [remote-dir]"
  exit 1
fi

if [[ ! -f "$APP_DIR/.env.production" ]]; then
  echo "ERROR: .env.production not found. Copy and fill it:"
  echo "  cp .env.example .env.production && nano .env.production"
  exit 1
fi

echo "🚀 Deploying to $VPS:$REMOTE_DIR"

# ── Step 1: Sync files ────────────────────────────────────────
echo "📦 Syncing project files..."
rsync -avz --progress \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='data/' \
  --exclude='.env.local' \
  --exclude='.env.*.local' \
  "$APP_DIR/" "$VPS:$REMOTE_DIR/"

# ── Step 2: Deploy on VPS ─────────────────────────────────────
echo "🐳 Building and starting containers..."
ssh "$VPS" bash << REMOTE_SCRIPT
  set -euo pipefail
  cd "$REMOTE_DIR"

  # Ensure data directory exists with correct permissions
  mkdir -p data

  # Pull base images
  docker compose pull nginx --ignore-pull-failures || true

  # Build app image
  docker compose build --no-cache app

  # Restart services (zero-downtime swap)
  docker compose up -d --remove-orphans

  # Clean up old images
  docker image prune -f

  echo "✅ Deployment complete!"
  docker compose ps
REMOTE_SCRIPT

echo ""
echo "✅ Done! Your site should be live at https://gwhyyy.com"
echo ""
echo "📋 Useful commands on your VPS:"
echo "   docker compose logs -f app     # App logs"
echo "   docker compose logs -f nginx   # Nginx logs"
echo "   docker compose ps              # Container status"
echo "   docker compose restart app     # Restart app"
