import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types/inventory';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  DollarSign,
  PackagePlus,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  isBought: boolean;
  storageLocation: 'Fridge' | 'Freezer' | 'Pantry' | 'Counter';
  defaultShelfLifeDays: number;
}

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBoughtToInventory: (item: Partial<InventoryItem>) => void;
}

const STORAGE_KEY = 'food_tracker_shopping_list_v1';

const INITIAL_SHOPPING_ITEMS: ShoppingItem = {
  id: 'shop-1',
  name: 'Organic Whole Milk',
  category: 'Dairy & Eggs',
  quantity: 1,
  unit: 'liters',
  estimatedPrice: 4.29,
  isBought: false,
  storageLocation: 'Fridge',
  defaultShelfLifeDays: 10,
};

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  onAddBoughtToInventory,
}) => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [INITIAL_SHOPPING_ITEMS];
    } catch (e) {
      return [INITIAL_SHOPPING_ITEMS];
    }
  });

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Dairy & Eggs');
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState(3.5);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingItems));
    } catch (e) {}
  }, [shoppingItems]);

  useEffect(() => {
    const handleSync = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setShoppingItems(JSON.parse(raw));
      } catch (e) {}
    };
    window.addEventListener('shopping_list_updated', handleSync);
    return () => window.removeEventListener('shopping_list_updated', handleSync);
  }, []);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      quantity: Number(newQty) || 1,
      unit: 'pieces',
      estimatedPrice: Number(newPrice) || 0,
      isBought: false,
      storageLocation: newCategory === 'Dairy & Eggs' || newCategory === 'Meat & Seafood' ? 'Fridge' : 'Pantry',
      defaultShelfLifeDays: newCategory === 'Fresh Produce' ? 7 : 14,
    };

    setShoppingItems([newItem, ...shoppingItems]);
    setNewName('');
  };

  const handleToggleBought = (item: ShoppingItem) => {
    if (!item.isBought) {
      // Mark as bought and transfer directly to inventory with fresh date!
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}

      const today = new Date().toISOString().split('T')[0];
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + (item.defaultShelfLifeDays || 10));

      onAddBoughtToInventory({
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        storageLocation: item.storageLocation,
        manufactureDate: today,
        expiryDate: expDate.toISOString().split('T')[0],
        cost: item.estimatedPrice,
      });

      // Update state
      setShoppingItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isBought: true } : i))
      );
    } else {
      setShoppingItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isBought: false } : i))
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    setShoppingItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCartCost = shoppingItems
    .filter((i) => !i.isBought)
    .reduce((sum, i) => sum + i.estimatedPrice, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Smart Grocery Replenishment List
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bought items transfer straight into your inventory!
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

          {/* Quick Add Form */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add item to buy (e.g. Eggs, Almond Milk, Oats)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Cart List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {shoppingItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Your shopping list is clear!
              </div>
            ) : (
              shoppingItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.isBought
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 opacity-70 line-through'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleBought(item)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        item.isBought
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {item.isBought && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{item.category} • Est. ${item.estimatedPrice.toFixed(2)}</span>
                        <span>•</span>
                        <a
                          href={`https://blinkit.com/s/?q=${encodeURIComponent(item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          Blinkit
                        </a>
                        <a
                          href={`https://www.bigbasket.com/ps/?q=${encodeURIComponent(item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                        >
                          BigBasket
                        </a>
                        <a
                          href={`https://www.zepto.com/search?query=${encodeURIComponent(item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                        >
                          Zepto
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!item.isBought && (
                      <button
                        onClick={() => handleToggleBought(item)}
                        title="Transfer to Inventory as fresh item"
                        className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60"
                      >
                        + Send to Fridge
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Cart Total */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Estimated Cart Total: </span>
              <strong className="text-slate-900 dark:text-white font-bold text-sm">
                ${totalCartCost.toFixed(2)}
              </strong>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
