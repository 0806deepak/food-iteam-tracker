import React, { useState } from 'react';
import { InventoryItem, UserProfile } from '../../types/inventory';
import { getDaysUntilExpiry } from '../../lib/inventoryFilters';
import {
  Layers,
  Sparkles,
  ShoppingBag,
  Activity,
  TrendingUp,
  Bell,
  Sun,
  Moon,
  Bot,
  ShoppingCart,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  X,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: 'inventory' | 'recipes' | 'analytics' | 'restock' | 'diet';
  onTabChange: (tab: 'inventory' | 'recipes' | 'analytics' | 'restock' | 'diet') => void;
  inventoryItems: InventoryItem[];
  userProfile: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  onOpenShoppingList: () => void;
  onOpenEcoBadges: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  inventoryItems,
  userProfile,
  isDarkMode,
  onToggleDarkMode,
  onOpenProfile,
  onOpenChat,
  onOpenShoppingList,
  onOpenEcoBadges,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Compute urgent expiring items for notifications
  const urgentItems = inventoryItems.filter((i) => {
    const days = getDaysUntilExpiry(i.expiryDate);
    return days >= 0 && days <= (userProfile.alertDaysBefore || 3);
  });

  const expiredItems = inventoryItems.filter((i) => {
    return getDaysUntilExpiry(i.expiryDate) < 0;
  });

  const totalNotifications = urgentItems.length + expiredItems.length;

  const requestBrowserPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && urgentItems.length > 0) {
        new Notification('Food Item Tracker Alert', {
          body: `You have ${urgentItems.length} food items expiring in the next ${userProfile.alertDaysBefore || 3} days! Check your recipes.`,
          icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=128&auto=format&fit=crop&q=80',
        });
      }
    }
  };

  const navItems: {
    id: 'inventory' | 'recipes' | 'diet' | 'restock' | 'analytics';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    { id: 'inventory', label: 'Tracker', icon: Layers, accentColor: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'recipes', label: 'Recipes', icon: Sparkles, accentColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'diet', label: 'Diet', icon: Activity, accentColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'restock', label: 'Shop', icon: ShoppingBag, accentColor: 'text-teal-600 dark:text-teal-400' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, accentColor: 'text-blue-600 dark:text-blue-400' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Main App Header & Brand Icon (Inspired by MyFitnessPal & Food Stories) */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onTabChange('inventory')}
            role="button"
            tabIndex={0}
            aria-label="Food Item Tracker Home"
          >
            {/* Custom Brand Icon */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 group-hover:shadow-emerald-600/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <UtensilsCrossed className="w-5 h-5 drop-shadow-xs" />
            </div>

            {/* Main Header Title (Clean, short, uncluttered) */}
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Food Item Tracker
              </h1>
            </div>
          </div>

          {/* Navigation Tabs (Short names, icons, animated sliding pill indicator) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 z-10 ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? item.accentColor : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Minimal Live Sync Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300"
              title={isOnline ? 'Online Synced' : 'Offline Mode'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[11px]">{isOnline ? 'Synced' : 'Offline'}</span>
            </div>

            {/* Shopping List Button */}
            <button
              onClick={onOpenShoppingList}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Shopping List"
              aria-label="Shopping List"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>

            {/* Eco Badges & Streaks */}
            <button
              onClick={onOpenEcoBadges}
              className="p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
              title="Achievements & Streaks"
              aria-label="Achievements"
            >
              <Trophy className="w-4.5 h-4.5" />
            </button>

            {/* AI Assistant button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Ask AI Chef"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chef AI</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Expiry Alerts ({totalNotifications})
                    </h4>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                    {urgentItems.length === 0 && expiredItems.length === 0 ? (
                      <div className="text-center py-4 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                        <p>No urgent items expiring!</p>
                      </div>
                    ) : (
                      <>
                        {urgentItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2 text-amber-900 dark:text-amber-200"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold block">{item.productName}</strong>
                              <span className="text-[11px] text-amber-700 dark:text-amber-300">
                                Expires {item.expiryDate} ({getDaysUntilExpiry(item.expiryDate)}d left)
                              </span>
                            </div>
                          </div>
                        ))}

                        {expiredItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2 text-rose-900 dark:text-rose-200"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold block">{item.productName}</strong>
                              <span className="text-[11px] text-rose-700 dark:text-rose-300">
                                Expired {item.expiryDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <button
                    onClick={requestBrowserPushPermission}
                    className="w-full py-1.5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Enable Browser Push Alerts
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Account"
              aria-label="Account"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {userProfile.name ? userProfile.name[0] : 'D'}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar (Clean short names, icon-driven, MyFitnessPal & Food Stories style) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
