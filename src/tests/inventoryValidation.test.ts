import { describe, it, expect } from 'vitest';
import { validateInventoryForm } from '../lib/inventoryValidation';

describe('inventoryValidation', () => {
  it('returns errors when required fields are missing', () => {
    const errors = validateInventoryForm({});
    expect(errors.productName).toBe('Product name is required');
    expect(errors.category).toBe('Category is required');
    expect(errors.quantity).toBe('Quantity must be greater than 0');
    expect(errors.manufactureDate).toBe('Manufacture date required');
    expect(errors.expiryDate).toBe('Expiry date required');
  });

  it('rejects quantity <= 0', () => {
    const errorsZero = validateInventoryForm({
      productName: 'Yogurt',
      category: 'Dairy',
      quantity: 0,
      manufactureDate: '2026-10-01',
      expiryDate: '2026-10-15',
    });
    expect(errorsZero.quantity).toBe('Quantity must be greater than 0');

    const errorsNeg = validateInventoryForm({
      productName: 'Yogurt',
      category: 'Dairy',
      quantity: -5,
      manufactureDate: '2026-10-01',
      expiryDate: '2026-10-15',
    });
    expect(errorsNeg.quantity).toBe('Quantity must be greater than 0');
  });

  it('validates that expiry date must be strictly after manufacture date', () => {
    const errorSameDate = validateInventoryForm({
      productName: 'Yogurt',
      category: 'Dairy',
      quantity: 2,
      manufactureDate: '2026-10-15',
      expiryDate: '2026-10-15',
    });
    expect(errorSameDate.expiryDate).toBe('Expiry date must be after manufacture date');

    const errorPriorDate = validateInventoryForm({
      productName: 'Yogurt',
      category: 'Dairy',
      quantity: 2,
      manufactureDate: '2026-10-20',
      expiryDate: '2026-10-10',
    });
    expect(errorPriorDate.expiryDate).toBe('Expiry date must be after manufacture date');
  });

  it('passes validation when valid data is provided', () => {
    const errors = validateInventoryForm({
      productName: 'Organic Almond Milk',
      category: 'Dairy & Eggs',
      quantity: 2,
      manufactureDate: '2026-10-01',
      expiryDate: '2026-10-25',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
