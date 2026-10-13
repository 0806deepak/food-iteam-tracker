import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { ExpiryBadge } from './ExpiryBadge';
import { InventoryActions } from './InventoryActions';
import { Barcode, MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface InventoryCardProps {
  item: InventoryItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onConsume: (item: InventoryItem) => void;
  onCardClick?: (item: InventoryItem) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onConsume,
  onCardClick,
}) => {
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => onCardClick && onCardClick(item)}
      className={`group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            {getCategoryEmoji(item.category)}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight line-clamp-1">
              {item.productName}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {item.category}
            </span>
          </div>
        </div>

        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onToggleSelect && onToggleSelect(item.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </div>

      {/* Expiry Badge */}
      <div className="mb-3">
        <ExpiryBadge expiryDate={item.expiryDate} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl mb-3">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-medium">Quantity</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {item.quantity} {item.unit}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-medium">Storage</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {item.storageLocation}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-medium">Mfg Date</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">{item.manufactureDate}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-medium">Expires</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">{item.expiryDate}</span>
        </div>
      </div>

      {item.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1 mb-3">
          "{item.notes}"
        </p>
      )}

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {item.barcode && (
            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
              <Barcode className="w-3 h-3" />
              {item.barcode.slice(-5)}
            </span>
          )}
          {item.cost && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ${item.cost.toFixed(2)}
            </span>
          )}
        </div>

        <InventoryActions
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onConsume={onConsume}
        />
      </div>
    </motion.div>
  );
};
