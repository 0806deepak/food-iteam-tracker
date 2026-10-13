import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { ExpiryBadge } from './ExpiryBadge';
import { InventoryActions } from './InventoryActions';
import {
  Refrigerator,
  Flame,
  Archive,
  Layers,
  Utensils,
  Barcode,
} from 'lucide-react';

interface InventoryRowProps {
  item: InventoryItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onConsume: (item: InventoryItem) => void;
  onRowClick?: (item: InventoryItem) => void;
}

export const InventoryRow: React.FC<InventoryRowProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onConsume,
  onRowClick,
}) => {
  const getLocationIcon = (loc: string) => {
    switch (loc) {
      case 'Fridge':
        return '🧊 Fridge';
      case 'Freezer':
        return '❄️ Freezer';
      case 'Pantry':
        return '🏺 Pantry';
      case 'Counter':
      default:
        return '🧺 Counter';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Dairy & Eggs':
        return '🥛';
      case 'Fresh Produce':
        return '🥦';
      case 'Bakery':
        return '🥖';
      case 'Meat & Seafood':
        return '🥩';
      case 'Pantry & Grains':
        return '🌾';
      case 'Beverages':
        return '🧃';
      case 'Frozen':
        return '🍧';
      case 'Snacks & Sweets':
        return '🍪';
      default:
        return '🍽️';
    }
  };

  return (
    <tr
      onClick={() => onRowClick && onRowClick(item)}
      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80 text-sm cursor-pointer"
    >
      {/* Selection checkbox */}
      <td className="py-3 px-4 w-10" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onToggleSelect && onToggleSelect(item.id)}
          className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </td>

      {/* Product Name & details */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="text-xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            {getCategoryEmoji(item.category)}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {item.productName}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{item.category}</span>
              {item.barcode && (
                <span className="hidden sm:inline-flex items-center gap-0.5 text-slate-400 font-mono text-[11px]">
                  <Barcode className="w-3 h-3" />
                  {item.barcode}
                </span>
              )}
              {item.dietaryType && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.dietaryType}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Storage Location */}
      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          {getLocationIcon(item.storageLocation)}
        </span>
      </td>

      {/* Quantity & Unit */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {item.quantity}
        </span>{' '}
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {item.unit}
        </span>
      </td>

      {/* Manufacture Date */}
      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
        {item.manufactureDate || '—'}
      </td>

      {/* Expiry Date & Countdown Badge */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="space-y-1">
          <ExpiryBadge expiryDate={item.expiryDate} />
          <div className="text-[11px] text-slate-400 font-mono">
            {item.expiryDate}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <InventoryActions
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onConsume={onConsume}
        />
      </td>
    </tr>
  );
};
