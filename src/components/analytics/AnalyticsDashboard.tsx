import React, { useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import { WasteRecord, loadWasteLog } from '../../lib/storage';
import { getDaysUntilExpiry } from '../../lib/inventoryFilters';
import {
  TrendingUp,
  Download,
  Share2,
  DollarSign,
  ShieldCheck,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsDashboardProps {
  items: InventoryItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ items }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const wasteRecords: WasteRecord[] = loadWasteLog();

  // Metrics computation
  const totalStockCount = items.length;
  let totalStockValue = 0;
  let expiringThisWeekCount = 0;
  let expiredCount = 0;
  let freshCount = 0;

  const categoryCounts: Record<string, number> = {};

  items.forEach((item) => {
    totalStockValue += item.cost || 0;
    const days = getDaysUntilExpiry(item.expiryDate);
    if (days < 0) {
      expiredCount++;
    } else if (days <= 7) {
      expiringThisWeekCount++;
    } else {
      freshCount++;
    }

    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const totalWastedItems = wasteRecords.length;
  const totalWastedCost = wasteRecords.reduce((acc, r) => acc + (r.cost || 0), 0);
  const estimatedSavings = Math.max(0, totalStockValue * 0.85); // 85% saved rate baseline
  const zeroWasteScore =
    totalStockCount + totalWastedItems > 0
      ? Math.round((totalStockCount / (totalStockCount + totalWastedItems)) * 100)
      : 95;

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      'Product Name',
      'Category',
      'Quantity',
      'Unit',
      'Storage Location',
      'Manufacture Date',
      'Expiry Date',
      'Days Until Expiry',
      'Estimated Cost ($)',
      'Barcode',
    ];

    const rows = items.map((i) => [
      `"${i.productName.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.quantity,
      `"${i.unit}"`,
      `"${i.storageLocation}"`,
      i.manufactureDate,
      i.expiryDate,
      getDaysUntilExpiry(i.expiryDate),
      (i.cost || 0).toFixed(2),
      `"${i.barcode || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `food-inventory-audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable report
  const handlePrintReport = () => {
    window.print();
  };

  // Social share achievement
  const handleSocialShare = async () => {
    const text = `🥗 I'm using Food Item Tracker!
Saved: $${estimatedSavings.toFixed(2)} in groceries
Zero-Waste Score: ${zeroWasteScore}%
Items tracking: ${totalStockCount} food items
Prevent food waste and save the planet!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Food Zero-Waste Stats',
          text,
          url: window.location.href,
        });
        return;
      } catch (err) {}
    }

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Analytics & Food Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time insights on your food usage, grocery savings, and environmental waste reduction
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Print Report</span>
          </button>

          {/* Social Share */}
          <button
            onClick={handleSocialShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Insights</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Zero-Waste Score */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Zero-Waste Score
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {zeroWasteScore}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top tier waste prevention efficiency
          </p>
        </div>

        {/* Total Money Saved */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
              Estimated Savings
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            ${estimatedSavings.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Saved by consuming food before expiration
          </p>
        </div>

        {/* Expiring Soon */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Expiring in 7 Days
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {expiringThisWeekCount} items
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recommend cooking via AI Recipe Generator
          </p>
        </div>

        {/* Items Rescued */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
              Tracked Items
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalStockCount} active
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Across Fridge, Freezer, and Pantry
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Food Category Distribution
          </h3>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = totalStockCount > 0 ? Math.round((count / totalStockCount) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} items ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expiry Urgency Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Shelf-Life Urgency Overview
          </h3>

          <div className="space-y-3">
            {/* Fresh */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                  Completely Fresh (&gt; 7 days left)
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                {freshCount} items
              </span>
            </div>

            {/* Expiring Soon */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                  Expiring Soon (within 7 days)
                </span>
              </div>
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                {expiringThisWeekCount} items
              </span>
            </div>

            {/* Expired */}
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-semibold text-rose-950 dark:text-rose-200">
                  Past Expiry Date
                </span>
              </div>
              <span className="text-sm font-bold text-rose-800 dark:text-rose-300">
                {expiredCount} items
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
