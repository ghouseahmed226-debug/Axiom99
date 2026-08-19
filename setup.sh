#!/usr/bin/env bash
# =============================================================================
# NexusWeb Monorepo Bootstrap Script
# [Agent-78: Git Strategy Master] + [Agent-83: GitHub Actions Automator]
# =============================================================================
set -euo pipefail
IFS=$'\n\t'

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${CYAN}[NexusWeb]${NC} $*"; }
ok()   { echo -e "${GREEN}[✔]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
die()  { echo -e "${RED}[✘] FATAL:${NC} $*"; exit 1; }

require_cmd() { command -v "$1" &>/dev/null || die "$1 is required but not installed."; }
require_cmd node
require_cmd npm
require_cmd git

NODE_VER=$(node -v | sed 's/v//'); MAJOR=${NODE_VER%%.*}
(( MAJOR >= 18 )) || die "Node.js >= 18 required (found $NODE_VER)"

log "Environment: Node $(node -v) | npm $(npm -v) | git $(git --version)"

ROOT="nexusweb"
mkdir -p "$ROOT" && cd "$ROOT"

if [ ! -d ".git" ]; then
  git init -q && git checkout -q -b main || git checkout -b main
  ok "Git repository initialized on branch main."
fi

log "Installing web dependencies..."
if [ -d "apps/web" ]; then
  cd apps/web && npm install --legacy-peer-deps && cd ../..
  ok "Web dependencies installed."
fi

if command -v pip &>/dev/null && [ -d "apps/api" ]; then
  log "Installing Python AI API dependencies..."
  pip install -q fastapi uvicorn xgboost scikit-learn numpy pandas pydantic slowapi httpx || warn "Python dependency installation skipped or failed."
fi

echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  ✅  NexusWeb Monorepo Initialized & Ready!        ${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Next commands:${NC}"
echo -e "  1. ${YELLOW}cd nexusweb${NC}"
echo -e "  2. ${YELLOW}cp .env.example .env${NC}"
echo -e "  3. ${YELLOW}cd apps/web && npm run dev${NC}  --> http://localhost:3000"
echo -e "  4. ${YELLOW}cd apps/api && uvicorn src.main:app --reload${NC} --> http://localhost:8000"
echo ""
