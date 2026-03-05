import { useState } from 'react';
import type { Artist, PaginatedResponse } from '../types';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';

interface ArtistsProps {
  onSelectArtist: (artist: Artist) => void;
}

const PAGE_SIZE = 12;

export function Artists({ onSelectArtist }: ArtistsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useFetch<PaginatedResponse<Artist>>(
    () => api.artists.list(currentPage, PAGE_SIZE),
    [currentPage]
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.meta && currentPage < Math.ceil(data.meta.total / PAGE_SIZE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <div>Loading artists...</div>;
  }

  if (error) {
    return <div>Error loading artists: {error.message}</div>;
  }

  if (!data?.data || data.data.length === 0) {
    return <div>No artists found</div>;
  }

  const totalPages = Math.ceil(data.meta.total / PAGE_SIZE);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          overflowY: 'auto',
        }}
      >
        {data.data.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelectArtist(artist)}
            style={{ cursor: 'pointer' }}
          >
            {artist.image && <img src={artist.image} alt={artist.name} />}
            <h3>{artist.name}</h3>
            {artist.bio && <p>{artist.bio}</p>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
