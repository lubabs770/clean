# Music App

A Node.js API that scans a music folder, paired with a React + TypeScript frontend.

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/lubabs770/clean/main/install.sh -o install.sh && chmod +x install.sh && ./install.sh
```

Enter your music directory, services boot on ports 3001 (API) and 5173 (UI).

## Local Setup

**Backend:**
```bash
cd server
npm install
./cli.js /path/to/music     # or: node server.js /path/to/music
```

**Frontend:**
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
