#!/bin/bash

# Music App Installer
# Prompts for and configures the docker-compose setup, then starts the services.

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

# Check if docker-compose.yaml exists
if [ ! -f "docker-compose.yaml" ]; then
  echo "❌ docker-compose.yaml not found in current directory"
  exit 1
fi

# Backup the original
cp docker-compose.yaml docker-compose.yaml.bak

# Update the volumes path in docker-compose.yaml
# This sed command replaces /path/to/your/music with the user's path
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS requires -i with a backup extension
  sed -i '' "s|/path/to/your/music|$MUSIC_DIR|g" docker-compose.yaml
else
  # Linux
  sed -i "s|/path/to/your/music|$MUSIC_DIR|g" docker-compose.yaml
fi

echo "📝 Updated docker-compose.yaml"
echo ""
echo "Starting services..."
echo "  🌐 API:  http://localhost:3001"
echo "  🎨 UI:   http://localhost:5173"
echo ""

docker-compose up
