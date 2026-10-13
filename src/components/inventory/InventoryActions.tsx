import React from 'react';
import { Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';
import confetti from 'canvas-confetti';

interface InventoryActionsProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onConsume: (item: InventoryItem) => void;
}

export const InventoryActions: React.FC<InventoryActionsProps> = ({
  item,
  onEdit,
  onDelete,
  onConsume,
}) => {
  const handleConsume = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#F59E0B'],
      });
    } catch (err) {
      // ignore
    }
    onConsume(item);
  };

  return (
    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
      {/* Mark Consumed Button */}
      <button
        onClick={handleConsume}
        title="Mark as Consumed (Saved from waste!)"
        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 transition-colors"
      >
        <Check className="w-4 h-4" />
      </button>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(item)}
        title="Edit item details"
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {/* Delete / Waste Button */}
      <button
        onClick={() => onDelete(item)}
        title="Delete item or log as wasted"
        className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
