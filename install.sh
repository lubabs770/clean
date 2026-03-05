#!/bin/bash

# Music App Installer
# Minimal local setup: downloads docker-compose.yaml, prompts for music directory,
# and lets Docker handle cloning and setting up the entire app.

set -e

echo "🎵 Music App Setup"
echo "=================="
echo ""

# Prompt for music directory
read -p "Enter the path to your music directory: " MUSIC_DIR

# Expand ~ to home directory
MUSIC_DIR="${MUSIC_DIR/#\~/$HOME}"

# Validate directory exists
if [ ! -d "$MUSIC_DIR" ]; then
  echo "❌ Directory not found: $MUSIC_DIR"
  exit 1
fi

# Resolve to absolute path for clarity
MUSIC_DIR="$(cd "$MUSIC_DIR" && pwd)"

echo "✅ Using music directory: $MUSIC_DIR"
echo ""

# Create a minimal temp working directory
WORK_DIR=$(mktemp -d)
cd "$WORK_DIR"

echo "📦 Downloading docker-compose configuration..."

# Download just the docker-compose.yaml
curl -fsSL https://raw.githubusercontent.com/lubabs770/clean/main/docker-compose.yaml -o docker-compose.yaml

# Update the volumes path
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|/path/to/your/music|$MUSIC_DIR|g" docker-compose.yaml
else
  sed -i "s|/path/to/your/music|$MUSIC_DIR|g" docker-compose.yaml
fi

echo "📝 Configured services"
echo ""
echo "Starting containers (this may take a moment on first run)..."
echo "  🌐 API:  http://localhost:3001"
echo "  🎨 UI:   http://localhost:5173"
echo ""

docker-compose up
