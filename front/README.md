# Musicy - Music App

React + TypeScript + Vite music browser application.

## Setup

```bash
npm install
npm run dev        # Local dev server at http://localhost:5173
npm run build      # Production build
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Artists.tsx   # Artists grid with pagination
│   ├── Artist.tsx    # Single artist details + albums grid
│   └── Album.tsx     # Single album details + tracks list
├── hooks/
│   └── useFetch.ts   # Generic data fetching hook
├── App.tsx           # Main app layout
├── View.tsx          # View state management
├── api.ts            # API client
├── types.ts          # TypeScript interfaces
└── main.tsx
```

## API Structure

The app expects a local API server running on `http://localhost:3001/api`.

### Endpoints

**Artists (Paginated)**
```
GET /api/artists?page=1&pageSize=12
↓ Response
{
  "data": [
    {
      "id": "artist-slug",
      "name": "The Beatles",
      "image": "http://localhost:3001/images/artists/artist-slug.jpg",
      "bio": "British rock band..."
    }
  ],
  "meta": { "page": 1, "pageSize": 12, "total": 150 }
}
```

**Artist Details**
```
GET /api/artists/:id
↓ Response
{
  "id": "artist-slug",
  "name": "The Beatles",
  "image": "http://localhost:3001/images/artists/artist-slug.jpg",
  "bio": "British rock band..."
}
```

**Artist Albums**
```
GET /api/artists/:id/albums
↓ Response
{
  "data": [
    {
      "id": "album-slug",
      "title": "Abbey Road",
      "artistId": "artist-slug",
      "releaseDate": "1969-09-26",
      "cover": "http://localhost:3001/images/albums/album-slug.jpg"
    }
  ]
}
```

**Album Details**
```
GET /api/albums/:id
↓ Response
{
  "id": "album-slug",
  "title": "Abbey Road",
  "artistId": "artist-slug",
  "releaseDate": "1969-09-26",
  "cover": "http://localhost:3001/images/albums/album-slug.jpg"
}
```

**Album Tracks**
```
GET /api/albums/:id/tracks
↓ Response
{
  "data": [
    {
      "id": "track-slug",
      "title": "Come Together",
      "duration": 259,
      "albumId": "album-slug",
      "artistId": "artist-slug"
    }
  ]
}
```

**Health Check**
```
GET /health
↓ Response
{
  "status": "ok",
  "timestamp": "2026-03-04T22:05:26.129Z",
  "artists": 1,
  "albums": 1,
  "tracks": 12
}
```

**Note:** All `image` and `cover` URLs are served directly from the filesystem. The grid automatically displays images and handles pagination.

## Components

- **Artists**: Scrollable grid with pagination (12 items/page), displays artist images and bios
- **Artist**: Shows artist details + grid of their albums, navigates to album details
- **Album**: Shows album details + numbered track list with durations

## Navigation Flow

Artists List → Artist Details → Album Details → Back to Artist

## Features

- ✅ TypeScript strict mode with proper error handling
- ✅ Custom `useFetch` hook for API calls with loading states
- ✅ Memory leak prevention in effects
- ✅ Responsive grid layouts
- ✅ Full navigation between artists → albums → tracks
- ✅ Duration formatting for tracks
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
