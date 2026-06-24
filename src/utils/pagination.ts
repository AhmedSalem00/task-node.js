import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Extracts and sanitizes pagination + sorting query params from a request.
 * Supported query params: page, limit, sortBy, sortOrder
 */
export const getPagination = (req: Request, allowedSortFields: string[], defaultSortField = 'createdAt'): PaginationParams => {
  let page = parseInt(req.query.page as string, 10);
  let limit = parseInt(req.query.limit as string, 10);

  if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const requestedSortBy = (req.query.sortBy as string) || defaultSortField;
  const sortBy = allowedSortFields.includes(requestedSortBy) ? requestedSortBy : defaultSortField;

  const requestedSortOrder = ((req.query.sortOrder as string) || 'DESC').toUpperCase();
  const sortOrder: 'ASC' | 'DESC' = requestedSortOrder === 'ASC' ? 'ASC' : 'DESC';

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    sortBy,
    sortOrder,
  };
};

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export const buildPaginatedResult = <T>(rows: T[], count: number, params: PaginationParams): PaginatedResult<T> => ({
  data: rows,
  pagination: {
    totalItems: count,
    totalPages: Math.max(Math.ceil(count / params.limit), 1),
    currentPage: params.page,
    pageSize: params.limit,
  },
});
