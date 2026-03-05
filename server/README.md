# Music Server

Ultra-lightweight Node.js HTTP server for music metadata. **Zero dependencies** - pure Node.js built-ins.

## Directory Structure

```
music/
├── Artist Name/
│   ├── bio.txt          # Artist bio (optional, plain text)
│   ├── artist.jpg       # Artist image (optional, JPEG)
│   └── Album Name/
│       ├── cover.jpg    # Album cover (optional, JPEG)
│       └── *.mp3        # Music files (any format)
```

## Quick Start

```bash
cd server
./cli.js  # Interactive setup
```

Prompts for music directory, starts server in background, shows PID to kill.

## Manual Start

```bash
cd server
MUSIC_DIR=/path/to/music node server.js
```

## API Endpoints

**Base URL:** `http://localhost:3001`

### Artists List
```
GET /api/artists?page=1&pageSize=12
```
**Response:**
```json
{
  "data": [
    {
      "id": "artist-slug",
      "name": "Artist Name",
      "image": "http://localhost:3001/images/artists/artist-slug.jpg",
      "bio": "Artist biography..."
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 12,
    "total": 150
  }
}
```

### Artist Details
```
GET /api/artists/:id
```
**Response:** Single artist object (same format as above)

### Artist Albums
```
GET /api/artists/:id/albums
```
**Response:**
```json
{
  "data": [
    {
      "id": "album-slug",
      "title": "Album Title",
      "artistId": "artist-slug",
      "releaseDate": "1969-09-26",
      "cover": "http://localhost:3001/images/albums/album-slug.jpg"
    }
  ]
}
```

### Album Tracks
```
GET /api/albums/:id/tracks
```
**Response:**
```json
{
  "data": [
    {
      "id": "track-slug",
      "title": "Song Name",
      "duration": 180,
      "albumId": "album-slug",
      "artistId": "artist-slug"
    }
  ]
}
```

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-04T22:05:26.129Z",
  "artists": 1,
  "albums": 1,
  "tracks": 12
}
```

## Error Responses

- **404 Not Found:** `{"error": "Artist not found"}`
- **405 Method Not Allowed:** For non-GET requests
- **CORS:** All origins allowed

## Stopping

```bash
kill <PID>  # PID shown at startup
# or
pkill -f "node server.js"
```

## Notes

- **IDs**: URL-safe slugs (lowercase, hyphens, alphanumeric only)
- **Images**: Served from filesystem if `artist.jpg`/`cover.jpg` exist, otherwise placeholder URLs
- **Release Dates**: 
  - Extracted from folder name: `Album Name (1969)` → `1969-01-01`
  - Or from `release.txt` file: `1969-09-26` (YYYY-MM-DD format)
  - Default: `1969-09-26` if neither found
- **Tracks**: All files in album folder except `cover.jpg` and `release.txt`
- **Bio**: Plain text from `bio.txt`, "No bio available" if missing
- **Edge Cases**:
  - Missing `bio.txt`: Returns "No bio available"
  - Corrupted/missing images: Falls back to placeholder URLs
  - Empty directories: Ignored in scan
  - Invalid release dates: Uses default
- **Server**: Scans directory on startup only (restart to detect changes)