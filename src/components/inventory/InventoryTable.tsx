import React from 'react';
import { InventoryItem, SortField, SortOrder } from '../../types/inventory';
import { InventoryRow } from './InventoryRow';
import { ArrowUpDown, ArrowUp, ArrowDown, PackageX } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onConsume: (item: InventoryItem) => void;
  onRowClick?: (item: InventoryItem) => void;
  onResetFilters: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  sortField,
  sortOrder,
  onSortChange,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onConsume,
  onRowClick,
  onResetFilters,
}) => {
  const isAllSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));
  const isIndeterminate =
    selectedIds.length > 0 && !isAllSelected && items.some((i) => selectedIds.includes(i.id));

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    );
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <PackageX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          No food items found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          No items match your active search, category, or expiry filters.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {/* Select All */}
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>

              {/* Product */}
              <th
                onClick={() => onSortChange('productName')}
                className="py-3.5 px-4 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100">
                  <span>Product & Category</span>
                  {renderSortIcon('productName')}
                </div>
              </th>

              {/* Storage */}
              <th className="py-3.5 px-4">
                <span>Storage</span>
              </th>

              {/* Quantity */}
              <th
                onClick={() => onSortChange('quantity')}
                className="py-3.5 px-4 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100">
                  <span>Quantity</span>
                  {renderSortIcon('quantity')}
                </div>
              </th>

              {/* Mfg Date */}
              <th
                onClick={() => onSortChange('manufactureDate')}
                className="py-3.5 px-4 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100">
                  <span>Mfg Date</span>
                  {renderSortIcon('manufactureDate')}
                </div>
              </th>

              {/* Expiry Date */}
              <th
                onClick={() => onSortChange('expiryDate')}
                className="py-3.5 px-4 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100">
                  <span>Expiry & Status</span>
                  {renderSortIcon('expiryDate')}
                </div>
              </th>

              {/* Actions */}
              <th className="py-3.5 px-4 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <InventoryRow
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onConsume={onConsume}
                onRowClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
