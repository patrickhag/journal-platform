/**
 * Pagination utility functions for API routes
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Parse pagination parameters from request URL
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit = 10
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(
    1,
    Math.min(
      100,
      parseInt(searchParams.get('limit') || String(defaultLimit), 10)
    )
  );

  return { page, limit };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: calculatePagination(total, page, limit),
  };
}

/**
 * Apply pagination to an array (for client-side filtering scenarios)
 */
export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; total: number } {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
  };
}
