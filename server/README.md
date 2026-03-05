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

You must have the API running before the front‑end can fetch anything. The
frontend expects the server to listen on `http://localhost:3001` and expose the
`/api` and `/images` endpoints described below. During development the React
app proxies these paths to avoid cross‑origin requests.

The server is intentionally simple and can point at any directory on your
filesystem. Use the included `cli.js` helper to select the path interactively
or pass it directly on the command line:

```bash
cd server
npm install                # only needed if you ever add dependencies

# interactive mode (default music/ folder adjacent to repo root)
./cli.js

# or supply the path as an argument (no prompt):
./cli.js /absolute/or/relative/path
# or with a flag:
./cli.js --dir /path/to/music
./cli.js -d ../other/music-dir

# behind the scenes the script sets MUSIC_DIR for you, but you can still run
# the server manually:
MUSIC_DIR=/path/to/music node server.js
```

The server will log how many artists/albums/tracks it discovered. It scans the
directory once at startup, so restart after adding or changing files.

When the server starts it will log how many artists/albums/tracks it found.
Create a `music/` directory alongside the repo root and add some artist folders
if you want to see data. The server currently scans the directory on startup
only, so restart it after adding new media.

Prompts for music directory, starts server in background, shows PID to kill.

## Manual Start

You can also run the server without the helper script. The executable accepts
an optional path argument or uses the `MUSIC_DIR` environment variable:

```bash
cd server
node server.js /path/to/music          # pass directory directly
# or
MUSIC_DIR=/path/to/music node server.js # via env var
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
GET /health  (or `/api/health` for compatibility with the front‑end proxy)
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