import React, { useState, useEffect } from 'react';
import { InventoryItem, StorageLocation, DietaryType } from '../../types/inventory';
import { validateInventoryForm } from '../../lib/inventoryValidation';
import { X, Calendar, ScanBarcode, Sparkles, AlertCircle, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryEditModalProps {
  isOpen: boolean;
  itemToEdit: InventoryItem | null;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => Promise<void> | void;
  onOpenScanner?: () => void;
}

const CATEGORIES = [
  'Dairy & Eggs',
  'Fresh Produce',
  'Bakery',
  'Meat & Seafood',
  'Pantry & Grains',
  'Beverages',
  'Frozen',
  'Snacks & Sweets',
  'Condiments & Sauces',
];

const UNITS = ['pieces', 'kg', 'g', 'liters', 'ml', 'packs', 'cans', 'bottles', 'boxes'];

const STORAGE_LOCATIONS: StorageLocation[] = ['Fridge', 'Freezer', 'Pantry', 'Counter'];

export const InventoryEditModal: React.FC<InventoryEditModalProps> = ({
  isOpen,
  itemToEdit,
  onClose,
  onSave,
  onOpenScanner,
}) => {
  const isEditMode = !!itemToEdit;

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    productName: '',
    category: 'Dairy & Eggs',
    quantity: 1,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: getTodayStr(),
    expiryDate: '',
    barcode: '',
    cost: 0,
    dietaryType: 'Vegetarian',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Synchronize form when modal opens or itemToEdit changes
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        ...itemToEdit,
      });
    } else {
      const today = getTodayStr();
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 7);
      setFormData({
        productName: '',
        category: 'Dairy & Eggs',
        quantity: 1,
        unit: 'pieces',
        storageLocation: 'Fridge',
        manufactureDate: today,
        expiryDate: expDate.toISOString().split('T')[0],
        barcode: '',
        cost: 0,
        dietaryType: 'Vegetarian',
        notes: '',
      });
    }
    setErrors({});
    setGlobalError(null);
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Add days to manufacture date or today
  const applyPresetDays = (days: number) => {
    const base = formData.manufactureDate ? new Date(formData.manufactureDate) : new Date();
    base.setDate(base.getDate() + days);
    const newExpiry = base.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, expiryDate: newExpiry }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    const validationErrors = validateInventoryForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setGlobalError(err?.message || 'Failed to save inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track manufacturing and expiration dates for zero food waste
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {globalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{globalError}</span>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName || ''}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="e.g. Organic Greek Yogurt, Basmati Rice, Strawberries"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 ${
                  errors.productName
                    ? 'border-rose-400 ring-1 ring-rose-400'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.productName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.productName}</p>
              )}
            </div>

            {/* Category & Storage Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category || 'Dairy & Eggs'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.storageLocation || 'Fridge'}
                  onChange={(e) => handleChange('storageLocation', e.target.value as StorageLocation)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                >
                  {STORAGE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'Fridge' && '🧊 Fridge'}
                      {loc === 'Freezer' && '❄️ Freezer'}
                      {loc === 'Pantry' && '🏺 Pantry'}
                      {loc === 'Counter' && '🧺 Counter'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity, Unit & Cost */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={formData.quantity ?? 1}
                  onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 ${
                    errors.quantity
                      ? 'border-rose-400 ring-1 ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.quantity && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit
                </label>
                <select
                  value={formData.unit || 'pieces'}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cost ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost ?? 0}
                  onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Dates: Manufacture & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manufacture Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.manufactureDate || ''}
                    onChange={(e) => handleChange('manufactureDate', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 ${
                      errors.manufactureDate
                        ? 'border-rose-400 ring-1 ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.manufactureDate && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.manufactureDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 ${
                      errors.expiryDate
                        ? 'border-rose-400 ring-1 ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.expiryDate && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.expiryDate}</p>
                )}
              </div>
            </div>

            {/* Quick Expiry Presets */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                ⚡ Quick Shelf-Life Presets (from Mfg Date):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '+3 Days', days: 3 },
                  { label: '+7 Days (1 Wk)', days: 7 },
                  { label: '+14 Days (2 Wk)', days: 14 },
                  { label: '+30 Days (1 Mo)', days: 30 },
                  { label: '+60 Days (2 Mo)', days: 60 },
                  { label: '+6 Months', days: 180 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPresetDays(preset.days)}
                    className="px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Barcode & Diet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Barcode (UPC / EAN)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    placeholder="e.g. 8901262010015"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                  />
                  {onOpenScanner && (
                    <button
                      type="button"
                      onClick={onOpenScanner}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      title="Open barcode camera scanner"
                    >
                      <ScanBarcode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Category
                </label>
                <select
                  value={formData.dietaryType || 'Vegetarian'}
                  onChange={(e) => handleChange('dietaryType', e.target.value as DietaryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Vegetarian">🌱 Vegetarian</option>
                  <option value="Vegan">🥑 Vegan</option>
                  <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Storage Notes / Recipe Ideas
              </label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="e.g. Open package within 3 days; keep on middle shelf"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-sm shadow-emerald-600/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditMode ? 'Update Item' : 'Add to Inventory'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
