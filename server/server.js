const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

// Set the music directory – order of precedence:
// 1. explicit CLI argument (`node server.js /path/to/dir`)
// 2. MUSIC_DIR environment variable
// 3. default folder adjacent to repo root (`../music`)
let MUSIC_DIR = process.env.MUSIC_DIR || path.join(__dirname, '..', 'music');
if (process.argv[2]) {
  // resolve to absolute path so logging is clearer
  MUSIC_DIR = path.resolve(process.argv[2]);
}

// Scan the music directory to build data
function scanMusicDir(rootDir) {
  const artists = [];
  const albums = [];
  const tracks = [];

  if (!fs.existsSync(rootDir)) {
    console.log(`Music directory ${rootDir} does not exist. Please create it and add artist folders.`);
    return { artists, albums, tracks };
  }

  const artistDirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const artistDir of artistDirs) {
    const artistPath = path.join(rootDir, artistDir.name);
    const artistId = artistDir.name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Check for artist image
    const imagePath = path.join(artistPath, 'artist.jpg');
    const image = fs.existsSync(imagePath) ? `/images/artists/${artistId}.jpg` : 'https://via.placeholder.com/300x300?text=No+Image';

    // Check for bio
    const bioPath = path.join(artistPath, 'bio.txt');
    const bio = fs.existsSync(bioPath) ? fs.readFileSync(bioPath, 'utf8') : 'No bio available.';

    const artist = {
      id: artistId,
      name: artistDir.name,
      image,
      bio
    };

    artists.push(artist);

    // Scan albums
    const albumDirs = fs.readdirSync(artistPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const albumDir of albumDirs) {
      const albumPath = path.join(artistPath, albumDir.name);
      const albumId = `${artistId}-${albumDir.name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}`;

      // Check for cover
      const coverPath = path.join(albumPath, 'cover.jpg');
      const cover = fs.existsSync(coverPath) ? `/images/albums/${albumId}.jpg` : 'https://via.placeholder.com/300x300?text=No+Cover';

      // Extract release date from folder name (e.g., "Album (1969)") or release.txt
      let releaseDate = '1969-09-26'; // default
      const releaseMatch = albumDir.name.match(/\((\d{4})\)/);
      if (releaseMatch) {
        releaseDate = `${releaseMatch[1]}-01-01`;
      } else {
        const releasePath = path.join(albumPath, 'release.txt');
        if (fs.existsSync(releasePath)) {
          const releaseContent = fs.readFileSync(releasePath, 'utf8').trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(releaseContent)) {
            releaseDate = releaseContent;
          }
        }
      }

      const album = {
        id: albumId,
        title: albumDir.name.replace(/\s*\(\d{4}\)\s*$/, ''), // Remove year from title if present
        artistId,
        releaseDate,
        cover
      };

      albums.push(album);

      // Scan tracks
      const trackFiles = fs.readdirSync(albumPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && !dirent.name.startsWith('cover.') && !dirent.name.startsWith('release.'))
        .map(dirent => dirent.name);

      trackFiles.forEach((file, index) => {
        const trackId = `${albumId}-${file.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
        const title = path.parse(file).name; // Remove extension
        const duration = 180; // Placeholder - would need audio metadata parsing for real duration

        const track = {
          id: trackId,
          title,
          duration,
          albumId,
          artistId
        };

        tracks.push(track);
      });
    }
  }

  return { artists, albums, tracks };
}

const { artists, albums, tracks } = scanMusicDir(MUSIC_DIR);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    if (pathname === '/api/artists') {
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const data = artists.slice(start, end);
      const total = artists.length;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data, meta: { page, pageSize, total } }));
    } else if (pathname.startsWith('/api/albums/')) {
      const parts = pathname.split('/');
      if (parts.length === 4) {
        // /api/albums/:id
        const id = parts[3];
        const album = albums.find(a => a.id === id);
        if (album) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(album));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Album not found' }));
        }
      } else if (parts.length === 5 && parts[4] === 'tracks') {
        // /api/albums/:id/tracks
        const id = parts[3];
        const albumTracks = tracks.filter(t => t.albumId === id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: albumTracks }));
      }
    } else if (pathname.startsWith('/api/artists/')) {
      const parts = pathname.split('/');
      if (parts.length === 4) {
        // /api/artists/:id
        const id = parts[3];
        const artist = artists.find(a => a.id === id);
        if (artist) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(artist));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Artist not found' }));
        }
      } else if (parts.length === 5 && parts[4] === 'albums') {
        // /api/artists/:id/albums
        const id = parts[3];
        const artistAlbums = albums.filter(a => a.artistId === id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: artistAlbums }));
      }
    } else if (pathname.startsWith('/images/artists/')) {
      const id = pathname.split('/')[3].replace('.jpg', '');
      const artist = artists.find(a => a.id === id);
      if (artist) {
        const imagePath = path.join(MUSIC_DIR, artist.name, 'artist.jpg');
        if (fs.existsSync(imagePath)) {
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          fs.createReadStream(imagePath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Image not found');
        }
      } else {
        res.writeHead(404);
        res.end('Artist not found');
      }
    } else if (pathname.startsWith('/images/albums/')) {
      const id = pathname.split('/')[3].replace('.jpg', '');
      const album = albums.find(a => a.id === id);
      if (album) {
        const artist = artists.find(a => a.id === album.artistId);
        if (artist) {
          const imagePath = path.join(MUSIC_DIR, artist.name, album.title, 'cover.jpg');
          if (fs.existsSync(imagePath)) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            fs.createReadStream(imagePath).pipe(res);
          } else {
            res.writeHead(404);
            res.end('Cover not found');
          }
        } else {
          res.writeHead(404);
          res.end('Artist not found');
        }
      } else {
        res.writeHead(404);
        res.end('Album not found');
      }
    } else if (pathname === '/health' || pathname === '/api/health') {
      // diagnose command-line / proxy compatibility; the front-end builds
      // requests to `/api/health` so we mirror it here.
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        artists: artists.length,
        albums: albums.length,
        tracks: tracks.length
      }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Music server running on http://localhost:${PORT}`);
  console.log(`Serving music from: ${MUSIC_DIR}`);
  console.log(`Found ${artists.length} artists, ${albums.length} albums, ${tracks.length} tracks`);
});