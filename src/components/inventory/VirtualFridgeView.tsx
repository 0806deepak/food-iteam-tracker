import React, { useState } from 'react';
import { InventoryItem, StorageLocation } from '../../types/inventory';
import { getDaysUntilExpiry, getExpiryStatus } from '../../lib/inventoryFilters';
import { ExpiryBadge } from './ExpiryBadge';
import {
  Refrigerator,
  Flame,
  Thermometer,
  Droplets,
  Sparkles,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface VirtualFridgeViewProps {
  items: InventoryItem[];
  onConsume: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onCookItem?: (item: InventoryItem) => void;
}

export const VirtualFridgeView: React.FC<VirtualFridgeViewProps> = ({
  items,
  onConsume,
  onEdit,
  onCookItem,
}) => {
  const [activeZone, setActiveZone] = useState<StorageLocation>('Fridge');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Filter items in active zone
  const zoneItems = items.filter((i) => i.storageLocation === activeZone);

  // Zone presets & environments
  const ZONES: {
    id: StorageLocation;
    name: string;
    icon: string;
    temp: string;
    humidity: string;
    color: string;
    description: string;
  }[] = [
    {
      id: 'Fridge',
      name: 'Refrigerator',
      icon: '🧊',
      temp: '3.2°C / 38°F',
      humidity: '68% Opti-Humid',
      color: 'from-blue-600/20 via-cyan-500/10 to-transparent border-cyan-500/30',
      description: 'Chilled environment ideal for dairy, greens, deli, and opened condiments.',
    },
    {
      id: 'Freezer',
      name: 'Deep Freezer',
      icon: '❄️',
      temp: '-18.5°C / -1°F',
      humidity: 'Dry Cryo-Zone',
      color: 'from-indigo-600/20 via-blue-500/10 to-transparent border-indigo-500/30',
      description: 'Sub-zero preservation halting microbial activity for meats, berries, and bulk bread.',
    },
    {
      id: 'Pantry',
      name: 'Dry Pantry',
      icon: '🏺',
      temp: '20.8°C / 69°F',
      humidity: '42% Dry Storage',
      color: 'from-amber-600/20 via-orange-500/10 to-transparent border-amber-500/30',
      description: 'Dark, cool, and well-ventilated dry space for grains, pulses, oils, and canned foods.',
    },
    {
      id: 'Counter',
      name: 'Kitchen Counter',
      icon: '🧺',
      temp: '22.0°C / 72°F',
      humidity: '50% Ambient Air',
      color: 'from-emerald-600/20 via-teal-500/10 to-transparent border-emerald-500/30',
      description: 'Breathable counter space for ripening bananas, whole tomatoes, and baked goods.',
    },
  ];

  const currentZoneMeta = ZONES.find((z) => z.id === activeZone) || ZONES[0];

  // Distribute items onto 3 visual shelves: Top, Middle, Crisper/Bottom
  const shelf1 = zoneItems.filter((_, idx) => idx % 3 === 0);
  const shelf2 = zoneItems.filter((_, idx) => idx % 3 === 1);
  const shelf3 = zoneItems.filter((_, idx) => idx % 3 === 2);

  const getEmoji = (category: string) => {
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
        return '🍨';
      case 'Snacks & Sweets':
        return '🍪';
      default:
        return '🥗';
    }
  };

  const handleQuickEat = (item: InventoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch (err) {}
    onConsume(item);
    if (selectedItem?.id === item.id) setSelectedItem(null);
  };

  const renderShelfItem = (item: InventoryItem) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    const isCritical = days >= 0 && days <= 3;
    const isWarning = days > 3 && days <= 7;
    const isExpired = days < 0;

    return (
      <motion.div
        key={item.id}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSelectedItem(item)}
        className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border shadow-md cursor-pointer transition-all ${
          isExpired
            ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-rose-500/10'
            : isCritical
            ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/10 animate-[pulse_2s_infinite]'
            : 'border-slate-200 dark:border-slate-700/80 hover:border-emerald-400'
        }`}
      >
        {/* Glow status dot */}
        <span
          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
            isExpired
              ? 'bg-rose-500'
              : isCritical
              ? 'bg-amber-500'
              : isWarning
              ? 'bg-yellow-400'
              : 'bg-emerald-500'
          }`}
        />

        <div className="text-3xl mb-1 filter drop-shadow-sm select-none">
          {getEmoji(item.category)}
        </div>

        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px] text-center">
          {item.productName}
        </span>

        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          {days < 0 ? 'Expired' : `${days}d left`}
        </span>

        {/* Quick hover badge */}
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
            Inspect
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Zone Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id;
          const count = items.filter((i) => i.storageLocation === zone.id).length;
          return (
            <button
              key={zone.id}
              onClick={() => {
                setActiveZone(zone.id);
                setSelectedItem(null);
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{zone.icon}</span>
                <div>
                  <div className="text-xs font-bold leading-tight">{zone.name}</div>
                  <div className="text-[10px] opacity-70">{zone.temp}</div>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 dark:bg-slate-900/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Virtual Appliance Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/90 to-slate-200/80 dark:from-slate-900 dark:to-slate-950 p-5 shadow-inner">
        {/* Environment Specs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-300/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentZoneMeta.icon}</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentZoneMeta.name} Compartment</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Active Climate Control
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentZoneMeta.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-xs">
              <Thermometer className="w-3.5 h-3.5 text-blue-500" />
              <span>{currentZoneMeta.temp}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-xs">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" />
              <span>{currentZoneMeta.humidity}</span>
            </div>
          </div>
        </div>

        {/* Physical Shelves Container */}
        {zoneItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <span className="text-4xl block select-none">🍃</span>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No items stored in {currentZoneMeta.name}
            </p>
            <p className="text-xs text-slate-400">
              Add new food or change storage location to organize your kitchen rack.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Shelf 1: Top Glass Shelf */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Top Glass Rack</span>
                <span>{shelf1.length} items</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 min-h-[96px] p-3 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-slate-700/40">
                {shelf1.map(renderShelfItem)}
              </div>
              {/* Glass shelf line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400/30 via-cyan-400/60 to-cyan-400/30 rounded-full shadow-xs backdrop-blur-xs" />
            </div>

            {/* Shelf 2: Middle Storage Shelf */}
            {shelf2.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Middle Storage Tier</span>
                  <span>{shelf2.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 min-h-[96px] p-3 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-slate-700/40">
                  {shelf2.map(renderShelfItem)}
                </div>
                {/* Glass shelf line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400/30 via-cyan-400/60 to-cyan-400/30 rounded-full shadow-xs backdrop-blur-xs" />
              </div>
            )}

            {/* Shelf 3: Crisper Drawer / Heavy Base */}
            {shelf3.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Crisper Humidity Bin / Base</span>
                  <span>{shelf3.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 min-h-[96px] p-3 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-slate-700/40">
                  {shelf3.map(renderShelfItem)}
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400/30 via-emerald-400/60 to-emerald-400/30 rounded-full shadow-xs" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Item Quick Inspection Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="text-4xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                {getEmoji(selectedItem.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedItem.productName}
                  </h4>
                  <ExpiryBadge expiryDate={selectedItem.expiryDate} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Quantity: {selectedItem.quantity} {selectedItem.unit}</span>
                  <span>•</span>
                  <span>Manufactured: {selectedItem.manufactureDate}</span>
                  <span>•</span>
                  <span>Expires: {selectedItem.expiryDate}</span>
                  {selectedItem.cost && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">${selectedItem.cost.toFixed(2)}</span>
                    </>
                  )}
                </div>
                {selectedItem.notes && (
                  <p className="text-xs text-slate-500 italic mt-1">"{selectedItem.notes}"</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                onClick={(e) => handleQuickEat(selectedItem, e)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Eat / Consumed 🎉</span>
              </button>

              <button
                onClick={() => onEdit(selectedItem)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Edit
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="px-2.5 py-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
