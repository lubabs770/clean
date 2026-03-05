export interface Artist {
  id: string;
  name: string;
  image?: string;
  bio?: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  releaseDate?: string;
  cover?: string;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  albumId: string;
  artistId: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  artists: number;
  albums: number;
  tracks: number;
}
