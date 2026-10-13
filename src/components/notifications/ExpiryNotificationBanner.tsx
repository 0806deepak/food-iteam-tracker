import React, { useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import {
  Bell,
  BellRing,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExpiryNotificationBannerProps {
  permission: NotificationPermission;
  isSupported: boolean;
  expiringWithinTwoDays: InventoryItem[];
  onRequestPermission: () => Promise<boolean>;
  onTriggerTestNotification: () => Promise<boolean>;
  onCookExpiringItems?: () => void;
}

export const ExpiryNotificationBanner: React.FC<ExpiryNotificationBannerProps> = ({
  permission,
  isSupported,
  expiringWithinTwoDays,
  onRequestPermission,
  onTriggerTestNotification,
  onCookExpiringItems,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (!isSupported || isDismissed) return null;

  const count = expiringWithinTwoDays.length;

  const handleTest = async () => {
    const success = await onTriggerTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  // If permission is not yet granted, show the permission enable card
  if (permission !== 'granted') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Enable Daily 2-Day Expiry Push Alerts</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                Automatic Service Worker
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Get notified on your phone or desktop whenever items are within 48 hours of expiration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={onRequestPermission}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Enable Push Alerts</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // If items are expiring within 2 days, show the active urgent alert banner
  if (count > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <span>⚠️ {count} Food {count === 1 ? 'Item Expires' : 'Items Expire'} Within 48 Hours!</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold">
                Daily Check Active
              </span>
            </h4>
            <p className="text-xs text-amber-800/90 dark:text-amber-300">
              {expiringWithinTwoDays.slice(0, 3).map((i) => i.productName).join(', ')}
              {count > 3 ? ` and ${count - 3} more` : ''}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {onCookExpiringItems && (
            <button
              onClick={onCookExpiringItems}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cook in AI Recipe</span>
            </button>
          )}

          <button
            onClick={handleTest}
            className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-semibold transition-colors"
          >
            {testSent ? '✓ Alert Dispatched' : 'Push Test Alert'}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // If granted and no items expiring soon, show slim status chip
  return (
    <div className="mb-4 px-4 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>
          <strong>Daily 2-Day Expiry Service Active:</strong> All items in stock are currently fresh!
        </span>
      </div>
      <button
        onClick={handleTest}
        className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
      >
        <Volume2 className="w-3 h-3" />
        <span>{testSent ? 'Sent!' : 'Test Notification'}</span>
      </button>
    </div>
  );
};
