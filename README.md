# clean (monorepo)

This repository contains two separate applications:

* `front/` – a Vite‑powered React + TypeScript music browser
* `server/` – a zero‑dependency Node.js API that reads a filesystem tree

They are developed together but run independently during development. The
frontend makes XHR/fetch requests to the API at `http://localhost:3001/api`.

## Getting started

1. **Prepare sample data** (optional). Create a `music/` directory next to the
   repo root and add at least one artist folder with a `bio.txt` and a
   subdirectory for an album. The server will work without media but the
   interface will show no artists.

2. **Start the backend**:
   ```bash
   cd server
   npm install   # if instructed
   # run the server directly or via the helper script; the latter lets you
   # pick any music directory interactively or by passing a path.
   node server.js      # use default MUSIC_DIR or set MUSIC_DIR env var
   ./cli.js            # will prompt for directory (default ../music)
   ./cli.js /path/to/dir
   ./cli.js --dir ../other
   ```
   The server listens on port 3001 and prints a PID. Keep it running while
   you work on the frontend.

3. **Start the frontend**:
   ```bash
   cd front
   npm install
   npm run dev
   ```
   Vite runs at `http://localhost:5173`. It proxies `/api` and `/images` to the
   backend so the UI can fetch resources without encountering CORS errors.

4. **Open your browser** at `http://localhost:5173` and browse artists.

## Troubleshooting

* **"Can’t fetch artists"** – usually means the backend is not running or the
  proxy is misconfigured. Check that `http://localhost:3001/health` returns a
  JSON payload.
* **CORS errors** – development proxy is enabled; if you override
  `VITE_API_BASE_URL` make sure the server allows that origin (`*` by default).

## Advanced

You can add a root `package.json` with a concurrent script or use tools like
`concurrently` or `npm-run-all` to start both services with a single command.
That’s not required but may simplify project workflows.
### Docker

A `docker-compose.yaml` is included that builds both the API and frontend using
Alpine Node. Before running, **edit the `volumes` section** in `docker-compose.yaml`
and set the left side of the music mount to your local directory, e.g.:

```yaml
volumes:
  - /Users/you/Music:/music  # macOS
  - /home/you/Music:/music   # Linux
  - C:\Users\you\Music:/music # Windows (with WSL2)
```

Then:

```bash
docker-compose up
```

The services will clone the repo, install dependencies, and start:

- API on `http://localhost:3001`
- UI on `http://localhost:5173`
