export interface PaginationInput {
  page?: string;
  limit?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const buildPagination = ({ page, limit = 10 }: PaginationInput): PaginationOptions => {
  const parsedPage = Number.parseInt(page ?? '1', 10);
  const normalizedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const normalizedLimit = limit > 0 ? limit : 10;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

export const buildTotalPages = (totalItems: number, limit: number): number => {
  return totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
};
