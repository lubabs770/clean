const API_BASE_URL = 'http://localhost:3001/api';

export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function apiCall(
  endpoint: string,
  options?: RequestInit
): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export const api = {
  artists: {
    list: (page: number = 1, pageSize: number = 12) =>
      apiCall(`/artists?page=${page}&pageSize=${pageSize}`),
    get: (id: string) => apiCall(`/artists/${id}`),
    albums: (id: string) => apiCall(`/artists/${id}/albums`),
  },
  albums: {
    get: (id: string) => apiCall(`/albums/${id}`),
    tracks: (id: string) => apiCall(`/albums/${id}/tracks`),
  },
  health: () => apiCall('/health'),
};
