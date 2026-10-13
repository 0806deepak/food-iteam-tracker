export interface InventoryFormInput {
  productName?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  storageLocation?: string;
  manufactureDate?: string;
  expiryDate?: string;
  barcode?: string;
  cost?: number;
  dietaryType?: string;
  notes?: string;
}

export function validateInventoryForm(form: InventoryFormInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.productName || !form.productName.trim()) {
    errors.productName = 'Product name is required';
  } else if (form.productName.trim().length < 2) {
    errors.productName = 'Product name must be at least 2 characters';
  }

  if (!form.category || !form.category.trim()) {
    errors.category = 'Category is required';
  }

  if (form.quantity === undefined || form.quantity === null || isNaN(form.quantity) || form.quantity <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }

  if (!form.manufactureDate || !form.manufactureDate.trim()) {
    errors.manufactureDate = 'Manufacture date required';
  }

  if (!form.expiryDate || !form.expiryDate.trim()) {
    errors.expiryDate = 'Expiry date required';
  }

  if (form.manufactureDate && form.expiryDate) {
    const mfgTime = new Date(form.manufactureDate).getTime();
    const expTime = new Date(form.expiryDate).getTime();

    if (!isNaN(mfgTime) && !isNaN(expTime) && expTime <= mfgTime) {
      errors.expiryDate = 'Expiry date must be after manufacture date';
    }
  }

  return errors;
}
