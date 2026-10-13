import React, { useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import { X, Trash2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onPermanentDelete: (item: InventoryItem) => void;
  onMarkConsumed: (item: InventoryItem) => void;
  onMarkWasted: (item: InventoryItem, reason: 'expired' | 'spoiled' | 'forgotten' | 'other') => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  onClose,
  onPermanentDelete,
  onMarkConsumed,
  onMarkWasted,
}) => {
  const [wasteReason, setWasteReason] = useState<'expired' | 'spoiled' | 'forgotten' | 'other'>('expired');

  if (!isOpen || !item) return null;

  const handleConsumed = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onMarkConsumed(item);
    onClose();
  };

  const handleWasted = () => {
    onMarkWasted(item, wasteReason);
    onClose();
  };

  const handlePermanent = () => {
    onPermanentDelete(item);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Remove or Update Item
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.productName} ({item.quantity} {item.unit})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Did you consume this food or did it go to waste? Choose how to record this to keep your zero-waste analytics accurate:
          </p>

          <div className="space-y-2.5">
            {/* Option 1: Consumed */}
            <button
              onClick={handleConsumed}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    Consumed (Food Saved 🎉)
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-400">
                    Records money saved & zero-waste success
                  </div>
                </div>
              </div>
            </button>

            {/* Option 2: Wasted */}
            <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                    Discarded / Spoiled
                  </span>
                </div>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value as any)}
                  className="text-xs bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
                >
                  <option value="expired">Expired Date</option>
                  <option value="spoiled">Spoiled early</option>
                  <option value="forgotten">Forgotten in back</option>
                  <option value="other">Other reason</option>
                </select>
              </div>

              <button
                onClick={handleWasted}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Log as Discarded & Remove
              </button>
            </div>
          </div>

          {/* Delete without tracking */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              onClick={handlePermanent}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete without logging
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
