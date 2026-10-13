import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  Globe2,
  Droplets,
  Trees,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EcoAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsCount: number;
  totalSavedDollars: number;
}

export const EcoAchievementsModal: React.FC<EcoAchievementsModalProps> = ({
  isOpen,
  onClose,
  itemsCount,
  totalSavedDollars,
}) => {
  if (!isOpen) return null;

  // Real environmental formulas (FAO UN Food Waste stats):
  // 1 kg food waste ~ 2.5 kg CO2e, ~ 250 liters embedded agricultural water
  const estKgSaved = itemsCount * 0.45; // ~0.45 kg per item
  const co2PreventedKg = (estKgSaved * 2.5).toFixed(1);
  const waterSavedLiters = Math.round(estKgSaved * 250);

  const badges = [
    {
      id: 'b1',
      title: 'Green Seedling',
      description: 'Tracked your first 5 food items in the pantry',
      icon: '🌱',
      unlocked: itemsCount >= 5,
      progress: Math.min(100, Math.round((itemsCount / 5) * 100)),
    },
    {
      id: 'b2',
      title: 'Fridge Commander',
      description: 'Organized items across Fridge, Freezer, and Pantry shelves',
      icon: '🧊',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'b3',
      title: 'Zero-Waste Warrior',
      description: 'Prevented over $50 in grocery waste from entering landfills',
      icon: '🛡️',
      unlocked: totalSavedDollars >= 50,
      progress: Math.min(100, Math.round((totalSavedDollars / 50) * 100)),
    },
    {
      id: 'b4',
      title: 'Culinary Alchemist',
      description: 'Generated world cuisine recipes from leftover grocery stock',
      icon: '🍳',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'b5',
      title: 'Barcode & Vision Pioneer',
      description: 'Scanned barcodes & packaging with camera AI',
      icon: '⚡',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'b6',
      title: 'Earth Guardian',
      description: 'Saved more than 25 kg of carbon emissions (CO2e)',
      icon: '🌍',
      unlocked: Number(co2PreventedKg) >= 25,
      progress: Math.min(100, Math.round((Number(co2PreventedKg) / 25) * 100)),
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Eco-Impact & Achievements</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    Level 4 Hero
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your household food waste prevention milestones
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

          {/* Environmental Impact Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span className="flex items-center gap-1.5 font-bold">
                <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                7-Day Zero-Waste Streak Active!
              </span>
              <span>Updated Today</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-500/40">
              <div>
                <div className="text-xl font-extrabold">{co2PreventedKg} kg</div>
                <div className="text-[10px] text-emerald-100/90 flex items-center justify-center gap-1">
                  <Trees className="w-3 h-3" /> CO2e Saved
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold">{waterSavedLiters} L</div>
                <div className="text-[10px] text-emerald-100/90 flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" /> Water Conserved
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold">${totalSavedDollars.toFixed(0)}</div>
                <div className="text-[10px] text-emerald-100/90">Grocery Saved</div>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Earned Badges ({badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                    b.unlocked
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                      : 'bg-slate-100/40 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-2xl select-none">{b.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {b.title}
                      </span>
                      {b.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {b.description}
                    </p>

                    <div className="mt-2 w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${b.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Every meal saved fights climate change 🌿</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
