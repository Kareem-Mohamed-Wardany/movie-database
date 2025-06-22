export interface Director {
  id: string;
  name: string;
  birthDate: string;
  image: string;
}
export interface PaginatedDirectorsResponse {
  page: number;
  limit: number;
  totalPages: number;
  directors: Director[];
}
