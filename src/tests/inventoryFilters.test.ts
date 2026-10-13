import { describe, it, expect } from 'vitest';
import {
  filterInventory,
  getDaysUntilExpiry,
  getExpiryStatus,
  isExpiringThisWeek,
} from '../lib/inventoryFilters';
import { InventoryItem } from '../types/inventory';

const mockBaseDate = new Date('2026-10-12T00:00:00Z');

const sampleItems: InventoryItem[] = [
  {
    id: '1',
    productName: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    quantity: 1,
    unit: 'liters',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-01',
    expiryDate: '2026-10-14', // +2 days (Expiring soon / this week)
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: '2',
    productName: 'Fresh Strawberries',
    category: 'Fresh Produce',
    quantity: 2,
    unit: 'boxes',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-08',
    expiryDate: '2026-10-11', // -1 day (Expired yesterday)
    createdAt: '2026-10-08T08:00:00Z',
    updatedAt: '2026-10-08T08:00:00Z',
  },
  {
    id: '3',
    productName: 'Basmati Rice',
    category: 'Pantry & Grains',
    quantity: 5,
    unit: 'kg',
    storageLocation: 'Pantry',
    manufactureDate: '2026-06-01',
    expiryDate: '2027-06-01', // +232 days (Fresh)
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z',
  },
  {
    id: '4',
    productName: 'Greek Yogurt Vanilla',
    category: 'Dairy & Eggs',
    quantity: 3,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-05',
    expiryDate: '2026-10-18', // +6 days (This week)
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
  },
];

describe('inventoryFilters', () => {
  it('calculates days until expiry accurately', () => {
    expect(getDaysUntilExpiry('2026-10-14', mockBaseDate)).toBe(2);
    expect(getDaysUntilExpiry('2026-10-11', mockBaseDate)).toBe(-1);
    expect(getDaysUntilExpiry('2026-10-12', mockBaseDate)).toBe(0);
  });

  it('determines expiry status badge and severity', () => {
    const expired = getExpiryStatus('2026-10-11', mockBaseDate);
    expect(expired.status).toBe('expired');
    expect(expired.daysLeft).toBe(-1);

    const expiresToday = getExpiryStatus('2026-10-12', mockBaseDate);
    expect(expiresToday.status).toBe('critical');
    expect(expiresToday.daysLeft).toBe(0);

    const expiringSoon = getExpiryStatus('2026-10-14', mockBaseDate);
    expect(expiringSoon.status).toBe('critical');
    expect(expiringSoon.isExpiringThisWeek).toBe(true);

    const fresh = getExpiryStatus('2027-06-01', mockBaseDate);
    expect(fresh.status).toBe('fresh');
    expect(fresh.isExpiringThisWeek).toBe(false);
  });

  it('filters by search term in product name or category', () => {
    const milk = filterInventory(sampleItems, 'milk', 'All', 'All', false, 'All', 'All', mockBaseDate);
    expect(milk).toHaveLength(1);
    expect(milk[0].productName).toBe('Organic Whole Milk');

    const yogurt = filterInventory(sampleItems, 'yogurt', 'All', 'All', false, 'All', 'All', mockBaseDate);
    expect(yogurt).toHaveLength(1);
    expect(yogurt[0].productName).toBe('Greek Yogurt Vanilla');
  });

  it('filters by category', () => {
    const dairy = filterInventory(sampleItems, '', 'Dairy & Eggs', 'All', false, 'All', 'All', mockBaseDate);
    expect(dairy).toHaveLength(2);

    const pantry = filterInventory(sampleItems, '', 'Pantry & Grains', 'All', false, 'All', 'All', mockBaseDate);
    expect(pantry).toHaveLength(1);
    expect(pantry[0].productName).toBe('Basmati Rice');
  });

  it('filters expired items', () => {
    const expired = filterInventory(sampleItems, '', 'All', 'Expired', false, 'All', 'All', mockBaseDate);
    expect(expired).toHaveLength(1);
    expect(expired[0].productName).toBe('Fresh Strawberries');
  });

  it('filters expiring this week', () => {
    const thisWeek = filterInventory(sampleItems, '', 'All', 'All', true, 'All', 'All', mockBaseDate);
    // Milk (+2 days) and Yogurt (+6 days)
    expect(thisWeek).toHaveLength(2);
    expect(thisWeek.map((i) => i.productName)).toContain('Organic Whole Milk');
    expect(thisWeek.map((i) => i.productName)).toContain('Greek Yogurt Vanilla');
  });

  it('supports combined filters (search + category + status)', () => {
    const combined = filterInventory(
      sampleItems,
      'Organic',
      'Dairy & Eggs',
      'Expiring Soon',
      true,
      'All',
      'All',
      mockBaseDate
    );
    expect(combined).toHaveLength(1);
    expect(combined[0].productName).toBe('Organic Whole Milk');
  });
});
