#!/usr/bin/env bash
# Sunucuda (onlyjs-academy-server) çalıştırılır.
# Kullanım: ./scripts/deploy.sh [main|develop]
set -e

BRANCH="${1:-main}"
REPO_DIR="${REPO_DIR:-$HOME/onlyjs-academy}"

echo "==> Branch: $BRANCH, Dizin: $REPO_DIR"
cd "$REPO_DIR"

echo "==> Git güncelleniyor..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "==> Docker build ve up..."
docker compose build --no-cache
docker compose up -d

echo "==> Container durumu:"
docker compose ps

echo "==> Deploy tamamlandı."
