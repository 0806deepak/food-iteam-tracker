import { describe, it, expect } from 'vitest';
import { paginateItems, getAdjustedPage } from '../lib/pagination';

describe('pagination', () => {
  const testList = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);

  it('paginates first page properly with bounds', () => {
    const result = paginateItems(testList, 1, 10);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.totalItems).toBe(25);
    expect(result.paginatedItems).toHaveLength(10);
    expect(result.paginatedItems[0]).toBe('Item 1');
    expect(result.paginatedItems[9]).toBe('Item 10');
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPrevPage).toBe(false);
  });

  it('paginates intermediate and last page correctly', () => {
    const lastPage = paginateItems(testList, 3, 10);
    expect(lastPage.currentPage).toBe(3);
    expect(lastPage.paginatedItems).toHaveLength(5);
    expect(lastPage.paginatedItems[4]).toBe('Item 25');
    expect(lastPage.hasNextPage).toBe(false);
    expect(lastPage.hasPrevPage).toBe(true);
  });

  it('handles empty lists gracefully without errors', () => {
    const emptyResult = paginateItems([], 1, 10);
    expect(emptyResult.currentPage).toBe(1);
    expect(emptyResult.totalPages).toBe(1);
    expect(emptyResult.totalItems).toBe(0);
    expect(emptyResult.paginatedItems).toEqual([]);
    expect(emptyResult.startIndex).toBe(0);
  });

  it('clamps out-of-range requested page', () => {
    const clamped = paginateItems(testList, 99, 10);
    expect(clamped.currentPage).toBe(3);
  });

  it('adjusts page on deletion if current page becomes invalid', () => {
    // If we were on page 3 (with 21 items total, pageSize 10 = 3 pages) and deleted items down to 20 items (now 2 pages)
    const adjusted = getAdjustedPage(3, 20, 10);
    expect(adjusted).toBe(2);

    const normal = getAdjustedPage(2, 20, 10);
    expect(normal).toBe(2);
  });
});
