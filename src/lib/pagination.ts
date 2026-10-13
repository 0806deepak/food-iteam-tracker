export interface PaginationResult<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginates an array of items safely
 */
export function paginateItems<T>(
  items: T[],
  currentPage: number = 1,
  pageSize: number = 8
): PaginationResult<T> {
  const totalItems = items.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  // Ensure current page is within 1 and totalPages
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    currentPage: validPage,
    totalPages,
    pageSize: safePageSize,
    totalItems,
    startIndex: totalItems === 0 ? 0 : startIndex + 1,
    endIndex,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

/**
 * Helper to adjust current page when items are deleted
 */
export function getAdjustedPage(
  currentPage: number,
  totalItemsAfterChange: number,
  pageSize: number = 8
): number {
  if (totalItemsAfterChange <= 0) return 1;
  const totalPages = Math.ceil(totalItemsAfterChange / pageSize);
  if (currentPage > totalPages) {
    return Math.max(1, totalPages);
  }
  return Math.max(1, currentPage);
}
