type PaginationQuery = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
};

export type ResultQuery<T> = {
  docs: T[];
} & PaginationQuery;
