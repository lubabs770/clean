import { useState } from 'react';
import type { Artist as ArtistType, Album } from './types';
import { Artists } from './components/Artists';
import { Artist } from './components/Artist';
import { Album as AlbumComponent } from './components/Album';

type ViewState = 'artists' | 'artist' | 'album';

interface ViewContext {
  state: ViewState;
  artistId?: string;
  albumId?: string;
}

export function View() {
  const [viewContext, setViewContext] = useState<ViewContext>({
    state: 'artists',
  });

  const handleSelectArtist = (artist: ArtistType) => {
    setViewContext({
      state: 'artist',
      artistId: artist.id,
    });
  };

  const handleBack = () => {
    setViewContext({
      state: 'artists',
    });
  };

  const handleSelectAlbum = (album: Album) => {
    setViewContext({
      state: 'album',
      albumId: album.id,
      artistId: album.artistId,
    });
  };

  const handleBackFromAlbum = () => {
    setViewContext({
      state: 'artist',
      artistId: viewContext.artistId,
    });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
      {viewContext.state === 'artists' && (
        <Artists onSelectArtist={handleSelectArtist} />
      )}

      {viewContext.state === 'artist' && viewContext.artistId && (
        <Artist artistId={viewContext.artistId} onBack={handleBack} onSelectAlbum={handleSelectAlbum} />
      )}

      {viewContext.state === 'album' && viewContext.albumId && (
        <AlbumComponent albumId={viewContext.albumId} onBack={handleBackFromAlbum} />
      )}
    </div>
  );
}
