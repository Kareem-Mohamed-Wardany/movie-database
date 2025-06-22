export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  image: string;
  rate: string;
  directorName: string;
}

export interface PaginatedMoviesResponse {
  page: number;
  limit: number;
  totalPages: number;
  movies: Movie[];
}

export interface ApiResponse<T> {
  statusCode: string;
  message: string;
  data: T;
}
export interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  duration: string;
  rate: string;
  directorId: string;
  imageFile: File;
}
