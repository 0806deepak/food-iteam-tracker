import { describe, it, expect } from 'vitest';
import { sortInventory } from '../lib/inventorySort';
import { InventoryItem } from '../types/inventory';

const items: InventoryItem[] = [
  {
    id: '1',
    productName: 'Banana',
    category: 'Fresh Produce',
    quantity: 5,
    unit: 'pieces',
    storageLocation: 'Counter',
    manufactureDate: '2026-10-01',
    expiryDate: '2026-10-18',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: '2',
    productName: 'Apple',
    category: 'Fresh Produce',
    quantity: 10,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-02',
    expiryDate: '2026-10-14',
    createdAt: '2026-10-02T08:00:00Z',
    updatedAt: '2026-10-02T08:00:00Z',
  },
  {
    id: '3',
    productName: 'Cheddar Cheese',
    category: 'Dairy & Eggs',
    quantity: 2,
    unit: 'blocks',
    storageLocation: 'Fridge',
    manufactureDate: '2026-09-15',
    expiryDate: '2026-11-01',
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-09-15T08:00:00Z',
  },
];

describe('inventorySort', () => {
  it('sorts by expiry date ascending', () => {
    const sorted = sortInventory(items, 'expiryDate', 'asc');
    expect(sorted[0].productName).toBe('Apple'); // Oct 14
    expect(sorted[1].productName).toBe('Banana'); // Oct 18
    expect(sorted[2].productName).toBe('Cheddar Cheese'); // Nov 01
  });

  it('sorts by expiry date descending', () => {
    const sorted = sortInventory(items, 'expiryDate', 'desc');
    expect(sorted[0].productName).toBe('Cheddar Cheese');
    expect(sorted[2].productName).toBe('Apple');
  });

  it('sorts alphabetically by product name', () => {
    const sorted = sortInventory(items, 'productName', 'asc');
    expect(sorted[0].productName).toBe('Apple');
    expect(sorted[1].productName).toBe('Banana');
    expect(sorted[2].productName).toBe('Cheddar Cheese');
  });

  it('sorts by quantity ascending and descending', () => {
    const asc = sortInventory(items, 'quantity', 'asc');
    expect(asc[0].quantity).toBe(2);
    expect(asc[2].quantity).toBe(10);

    const desc = sortInventory(items, 'quantity', 'desc');
    expect(desc[0].quantity).toBe(10);
    expect(desc[2].quantity).toBe(2);
  });
});
