import type { Artist as ArtistType, Album } from '../types';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';

interface ArtistProps {
  artistId: string;
  onBack: () => void;
  onSelectAlbum: (album: Album) => void;
}

export function Artist({ artistId, onBack, onSelectAlbum }: ArtistProps) {
  const { data: artist, loading: artistLoading, error: artistError } = useFetch<ArtistType>(
    () => api.artists.get(artistId),
    [artistId]
  );

  const { data: albums, loading: albumsLoading, error: albumsError } = useFetch<Album[]>(
    () => api.artists.albums(artistId),
    [artistId]
  );

  if (artistLoading) {
    return <div>Loading artist details...</div>;
  }

  if (artistError) {
    return <div>Error loading artist: {artistError.message}</div>;
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div>
      <button onClick={onBack}>Back</button>
      {artist.image && <img src={artist.image} alt={artist.name} />}
      <h1>{artist.name}</h1>
      {artist.bio && <p>{artist.bio}</p>}

      <h2>Albums</h2>
      {albumsLoading && <div>Loading albums...</div>}
      {albumsError && <div>Error loading albums: {albumsError.message}</div>}
      {albums && albums.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              style={{ cursor: 'pointer' }}
            >
              {album.cover && <img src={album.cover} alt={album.title} />}
              <h3>{album.title}</h3>
              {album.releaseDate && <p>Released: {album.releaseDate}</p>}
            </div>
          ))}
        </div>
      ) : (
        !albumsLoading && <div>No albums found</div>
      )}
    </div>
  );
}
