export interface Movie {
  mid: number;
  name: string;
  genre: string;
  price: number;
  rating: string;
  studio: number;
}

export interface Studio {
  sid: number;
  name: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
