import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { getDaysUntilExpiry } from '../../lib/inventoryFilters';
import { Package, AlertTriangle, AlertCircle, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SummaryCardsProps {
  items: InventoryItem[];
  currentStatusFilter: string;
  onFilterChange: (status: string) => void;
}

export const InventorySummaryCards: React.FC<SummaryCardsProps> = ({
  items,
  currentStatusFilter,
  onFilterChange,
}) => {
  let expiringThisWeekCount = 0;
  let expiredCount = 0;
  let freshCount = 0;
  let totalCost = 0;

  items.forEach((item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    if (days < 0) {
      expiredCount++;
    } else if (days <= 7) {
      expiringThisWeekCount++;
    } else {
      freshCount++;
    }
    totalCost += (item.cost || 0);
  });

  const cards = [
    {
      id: 'All',
      title: 'Total In Stock',
      value: items.length,
      subtitle: `${freshCount} completely fresh`,
      icon: Package,
      gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
      activeBorder: 'ring-2 ring-blue-500',
    },
    {
      id: 'Expiring This Week',
      title: 'Expiring This Week',
      value: expiringThisWeekCount,
      subtitle: expiringThisWeekCount > 0 ? 'Action needed soon' : 'All safe this week',
      icon: AlertTriangle,
      gradient: 'from-amber-500/15 to-orange-500/10 border-amber-300 dark:border-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
      badge: expiringThisWeekCount > 0 ? 'Urgent' : undefined,
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'Expired',
      title: 'Expired Items',
      value: expiredCount,
      subtitle: expiredCount > 0 ? 'Review & discard/compost' : 'Zero expired food!',
      icon: AlertCircle,
      gradient: 'from-rose-500/15 to-red-500/10 border-rose-300 dark:border-rose-900/50',
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40',
      badge: expiredCount > 0 ? 'Review' : undefined,
      activeBorder: 'ring-2 ring-rose-500',
    },
    {
      id: 'Value',
      title: 'Estimated Stock Value',
      value: `$${totalCost.toFixed(2)}`,
      subtitle: 'Track waste savings',
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
      activeBorder: '',
      isActionable: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        const isActive = currentStatusFilter === card.id;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            onClick={() => {
              if (card.isActionable !== false) {
                onFilterChange(card.id);
              }
            }}
            className={`relative p-4 rounded-2xl bg-gradient-to-br ${card.gradient} bg-white dark:bg-slate-900 border shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer ${
              isActive ? card.activeBorder : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {card.subtitle}
              </span>
              {card.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white dark:bg-amber-600">
                  {card.badge}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
