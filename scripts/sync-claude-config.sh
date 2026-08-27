#!/bin/bash
set -e

REPO_URL="git@github.com:thai-nm/garage.git"
REPO_DIR="$HOME/workplace/personal/garage"
CLAUDE_DIR="$HOME/.claude"

if [ -d "$REPO_DIR/.git" ]; then
  echo "Repo already cloned, pulling latest..."
  git -C "$REPO_DIR" pull
else
  echo "Cloning repo..."
  mkdir -p "$(dirname "$REPO_DIR")"
  git clone "$REPO_URL" "$REPO_DIR"
fi

echo "Populating Claude Code user config in $CLAUDE_DIR..."
mkdir -p "$CLAUDE_DIR"
cp "$REPO_DIR/.claude/settings.json" "$CLAUDE_DIR/settings.json"
cp "$REPO_DIR/.claude/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"

echo "Done. Updated:"
echo "  $CLAUDE_DIR/settings.json"
echo "  $CLAUDE_DIR/CLAUDE.md"
