import type { Album as AlbumType, Track } from '../types';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';

interface AlbumProps {
  albumId: string;
  onBack: () => void;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function Album({ albumId, onBack }: AlbumProps) {
  const { data: album, loading: albumLoading, error: albumError } = useFetch<AlbumType>(
    () => api.albums.get(albumId),
    [albumId]
  );

  const { data: tracks, loading: tracksLoading, error: tracksError } = useFetch<Track[]>(
    () => api.albums.tracks(albumId),
    [albumId]
  );

  if (albumLoading) {
    return <div>Loading album details...</div>;
  }

  if (albumError) {
    return <div>Error loading album: {albumError.message}</div>;
  }

  if (!album) {
    return <div>Album not found</div>;
  }

  return (
    <div>
      <button onClick={onBack}>Back</button>
      {album.cover && <img src={album.cover} alt={album.title} />}
      <h1>{album.title}</h1>
      {album.releaseDate && <p>Released: {album.releaseDate}</p>}

      <h2>Tracks</h2>
      {tracksLoading && <div>Loading tracks...</div>}
      {tracksError && <div>Error loading tracks: {tracksError.message}</div>}
      {tracks && tracks.length > 0 ? (
        <div>
          {tracks.map((track, index) => (
            <div key={track.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
              <div>
                <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>{index + 1}.</span>
                <span>{track.title}</span>
              </div>
              <span>{formatDuration(track.duration)}</span>
            </div>
          ))}
        </div>
      ) : (
        !tracksLoading && <div>No tracks found</div>
      )}
    </div>
  );
}
