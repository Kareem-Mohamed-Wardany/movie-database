export interface Actor {
  id: string;
  name: string;
  birthDate: string;
  image: string;
}
export interface PaginatedActorssResponse {
  page: number;
  limit: number;
  totalPages: number;
  actors: Actor[];
}
