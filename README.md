# clean (monorepo)

This repository contains two separate applications:

* `front/` – a Vite‑powered React + TypeScript music browser
* `server/` – a zero‑dependency Node.js API that reads a filesystem tree

They are developed together but run independently during development. The
frontend makes XHR/fetch requests to the API at `http://localhost:3001/api`.

## Getting started

**Quick start** (copy & paste):

```bash
curl -fsSL https://raw.githubusercontent.com/lubabs770/clean/main/install.sh -o install.sh && chmod +x install.sh && ./install.sh
```

This downloads the installer, makes it executable, and runs it. You'll be prompted for your music directory, then the services will start.

**Easiest way:** Run the installer script (requires Docker):

```bash
./install.sh
```

It will prompt for your music directory, configure the services, and start them.

**Manual setup:**

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

A `docker-compose.yaml` and installer script are included for a seamless setup.
**Use the installer** – it handles everything:

```bash
./install.sh
```

You will be prompted for your music directory path. The script will:

1. Validate the directory exists
2. Configure `docker-compose.yaml` with your path
3. Start the API and UI services

Once running:

- API: `http://localhost:3001`
- UI: `http://localhost:5173`

**Manual Docker setup** (if you prefer):

Edit `docker-compose.yaml` and set the music directory in the `volumes` section:

```yaml
volumes:
  - /Users/you/Music:/music  # macOS
  - /home/you/Music:/music   # Linux
  - C:\\Users\\you\\Music:/music # Windows (with WSL2)
```

Then:

```bash
docker-compose up
```
