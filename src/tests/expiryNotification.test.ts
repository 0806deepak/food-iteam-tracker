import { describe, it, expect, beforeEach } from 'vitest';
import {
  findItemsExpiringWithinDays,
  buildExpiryNotificationPayload,
} from '../lib/expiryNotificationService';
import { InventoryItem } from '../types/inventory';

const mockBaseDate = new Date('2026-10-12T00:00:00Z');

const testItems: InventoryItem[] = [
  {
    id: '1',
    productName: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    quantity: 1,
    unit: 'liters',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-01',
    expiryDate: '2026-10-14', // +2 days -> exactly within 2-day threshold
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: '2',
    productName: 'Baby Spinach',
    category: 'Fresh Produce',
    quantity: 200,
    unit: 'g',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-08',
    expiryDate: '2026-10-13', // +1 day -> within 2-day threshold
    createdAt: '2026-10-08T08:00:00Z',
    updatedAt: '2026-10-08T08:00:00Z',
  },
  {
    id: '3',
    productName: 'Fresh Strawberries',
    category: 'Fresh Produce',
    quantity: 1,
    unit: 'boxes',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-05',
    expiryDate: '2026-10-12', // +0 days -> expires today (within 2-day threshold)
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
  },
  {
    id: '4',
    productName: 'Greek Plain Yogurt',
    category: 'Dairy & Eggs',
    quantity: 2,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: '2026-10-05',
    expiryDate: '2026-10-16', // +4 days -> NOT within 2-day threshold
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
  },
  {
    id: '5',
    productName: 'Expired Artisan Loaf',
    category: 'Bakery',
    quantity: 1,
    unit: 'pieces',
    storageLocation: 'Counter',
    manufactureDate: '2026-10-01',
    expiryDate: '2026-10-10', // -2 days -> Expired
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
];

describe('expiryNotificationService', () => {
  it('correctly filters items expiring within 2 days', () => {
    const result = findItemsExpiringWithinDays(testItems, 2, mockBaseDate);

    // Should include: Milk (+2d), Spinach (+1d), Strawberries (0d)
    expect(result.expiringItems).toHaveLength(3);
    expect(result.totalExpiringSoonCount).toBe(3);
    const itemNames = result.expiringItems.map((i) => i.productName);
    expect(itemNames).toContain('Organic Whole Milk');
    expect(itemNames).toContain('Baby Spinach');
    expect(itemNames).toContain('Fresh Strawberries');
    expect(itemNames).not.toContain('Greek Plain Yogurt'); // +4 days
    expect(itemNames).not.toContain('Expired Artisan Loaf'); // already expired
  });

  it('correctly detects expired items', () => {
    const result = findItemsExpiringWithinDays(testItems, 2, mockBaseDate);
    expect(result.expiredItems).toHaveLength(1);
    expect(result.expiredItems[0].productName).toBe('Expired Artisan Loaf');
  });

  it('builds descriptive notification payload for multiple expiring items', () => {
    const { expiringItems } = findItemsExpiringWithinDays(testItems, 2, mockBaseDate);
    const payload = buildExpiryNotificationPayload(expiringItems);

    expect(payload.title).toContain('3 Food Items Expiring Within 2 Days');
    expect(payload.options.body).toContain('Baby Spinach');
    expect(payload.options.body).toContain('Organic Whole Milk');
    expect(payload.options.requireInteraction).toBe(true);
  });

  it('builds descriptive notification payload for a single expiring item', () => {
    const single = [testItems[0]]; // Milk (+2 days)
    const payload = buildExpiryNotificationPayload(single);

    expect(payload.title).toBe('⚠️ Urgent Expiry: Organic Whole Milk');
    expect(payload.options.body).toContain('expires in 2 days');
  });

  it('returns clean message when no items expire within 2 days', () => {
    const freshItems = [testItems[3]]; // Yogurt (+4 days)
    const { expiringItems, expiredItems } = findItemsExpiringWithinDays(freshItems, 2, mockBaseDate);
    const payload = buildExpiryNotificationPayload(expiringItems, expiredItems);

    expect(payload.title).toBe('✅ All Food Items Fresh');
    expect(payload.options.body).toContain('No items are expiring in the next 2 days');
  });
});
