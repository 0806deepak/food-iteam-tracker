import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, UserProfile, SortField, SortOrder } from './types/inventory';
import {
  loadInventoryItems,
  saveInventoryItems,
  loadUserProfile,
  saveUserProfile,
  saveWasteRecord,
} from './lib/storage';
import { filterInventory } from './lib/inventoryFilters';
import { sortInventory } from './lib/inventorySort';
import { paginateItems, getAdjustedPage } from './lib/pagination';

import { Navbar } from './components/layout/Navbar';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { InventorySummaryCards } from './components/inventory/InventorySummaryCards';
import { DailyMacroGlanceWidget } from './components/inventory/DailyMacroGlanceWidget';
import { Toolbar } from './components/inventory/Toolbar';
import { InventoryTable } from './components/inventory/InventoryTable';
import { InventoryCard } from './components/inventory/InventoryCard';
import { VirtualFridgeView } from './components/inventory/VirtualFridgeView';
import { Pager } from './components/inventory/Pager';
import { InventoryEditModal } from './components/inventory/InventoryEditModal';
import { DeleteConfirmModal } from './components/inventory/DeleteConfirmModal';
import { BarcodeScannerModal } from './components/inventory/BarcodeScannerModal';
import { CloudScannerHero } from './components/inventory/CloudScannerHero';
import { CloudDataExtractorModal } from './components/inventory/CloudDataExtractorModal';
import { ShoppingListModal } from './components/shopping/ShoppingListModal';
import { SmartRestockHub } from './components/shopping/SmartRestockHub';
import { DietPlansHub } from './components/diet/DietPlansHub';
import { EcoAchievementsModal } from './components/analytics/EcoAchievementsModal';
import { RecipeGenerator } from './components/recipes/RecipeGenerator';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AiChatAssistant } from './components/chat/AiChatAssistant';
import { AuthModal } from './components/auth/AuthModal';
import { useExpiryNotifications } from './hooks/useExpiryNotifications';
import { ExpiryNotificationBanner } from './components/notifications/ExpiryNotificationBanner';

import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCheck, Trash2 } from 'lucide-react';

export default function App() {
  // Global State
  const [items, setItems] = useState<InventoryItem[]>(() => loadInventoryItems());
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [activeTab, setActiveTab] = useState<'inventory' | 'recipes' | 'analytics' | 'restock' | 'diet'>('inventory');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'fridge'>('table');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('food_tracker_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  // Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [storageLocation, setStorageLocation] = useState('All');
  const [dietaryType, setDietaryType] = useState('All');
  const [expiringThisWeekOnly, setExpiringThisWeekOnly] = useState(false);

  // Sort State
  const [sortField, setSortField] = useState<SortField>('expiryDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isCloudExtractorOpen, setIsCloudExtractorOpen] = useState(false);
  const [cloudExtractorQuery, setCloudExtractorQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isEcoBadgesOpen, setIsEcoBadgesOpen] = useState(false);

  // Daily Expiry Notifications Hook (checks items expiring within 2 days)
  const {
    permission,
    isSupported,
    expiringWithinTwoDays,
    requestPermission,
    triggerTestNotification,
  } = useExpiryNotifications(items, {
    enabled: profile.notificationsEnabled,
    thresholdDays: 2,
    onNavigateTab: (tab) => setActiveTab(tab as any),
  });

  // Manage Dark Mode Class on root <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('food_tracker_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('food_tracker_theme', 'light');
    }
  }, [isDarkMode]);

  // Synchronize items across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      setItems(loadInventoryItems());
    };
    window.addEventListener('inventory_updated', handleStorageChange);
    return () => window.removeEventListener('inventory_updated', handleStorageChange);
  }, []);

  // Filter & Sort Pipeline using reusable pure logic
  const filteredItems = useMemo(() => {
    return filterInventory(
      items,
      search,
      category,
      status,
      expiringThisWeekOnly,
      storageLocation,
      dietaryType
    );
  }, [items, search, category, status, expiringThisWeekOnly, storageLocation, dietaryType]);

  const sortedItems = useMemo(() => {
    return sortInventory(filteredItems, sortField, sortOrder);
  }, [filteredItems, sortField, sortOrder]);

  // Pagination Slice
  const paginationResult = useMemo(() => {
    return paginateItems(sortedItems, currentPage, pageSize);
  }, [sortedItems, currentPage, pageSize]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, status, storageLocation, dietaryType, expiringThisWeekOnly]);

  // Handlers
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleOpenAddModal = () => {
    setItemToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    let updatedList: InventoryItem[];
    const now = new Date().toISOString();

    if (itemToEdit) {
      // Update existing item
      updatedList = items.map((i) =>
        i.id === itemToEdit.id ? ({ ...i, ...itemData, updatedAt: now } as InventoryItem) : i
      );
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productName: itemData.productName || 'Unknown Item',
        category: itemData.category || 'Dairy & Eggs',
        quantity: itemData.quantity || 1,
        unit: itemData.unit || 'pieces',
        storageLocation: itemData.storageLocation || 'Fridge',
        manufactureDate: itemData.manufactureDate || now.split('T')[0],
        expiryDate: itemData.expiryDate || now.split('T')[0],
        barcode: itemData.barcode,
        cost: itemData.cost || 0,
        dietaryType: itemData.dietaryType || 'Vegetarian',
        notes: itemData.notes,
        createdAt: now,
        updatedAt: now,
      };
      updatedList = [newItem, ...items];
    }

    setItems(updatedList);
    saveInventoryItems(updatedList);
    setIsEditModalOpen(false);
  };

  const handleDeletePrompt = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handlePermanentDelete = (item: InventoryItem) => {
    const updated = items.filter((i) => i.id !== item.id);
    setItems(updated);
    saveInventoryItems(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    setCurrentPage((prev) => getAdjustedPage(prev, updated.length, pageSize));
  };

  const handleMarkConsumed = (item: InventoryItem) => {
    // Record as consumed / saved
    const updated = items.filter((i) => i.id !== item.id);
    setItems(updated);
    saveInventoryItems(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    setCurrentPage((prev) => getAdjustedPage(prev, updated.length, pageSize));
  };

  const handleMarkWasted = (
    item: InventoryItem,
    reason: 'expired' | 'spoiled' | 'forgotten' | 'other'
  ) => {
    // Log in waste audit
    saveWasteRecord({
      id: `waste_${Date.now()}`,
      itemId: item.id,
      productName: item.productName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      cost: item.cost || 0,
      date: new Date().toISOString(),
      reason,
    });

    const updated = items.filter((i) => i.id !== item.id);
    setItems(updated);
    saveInventoryItems(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    setCurrentPage((prev) => getAdjustedPage(prev, updated.length, pageSize));
  };

  const handleBarcodeDetected = (code: string, meta?: any) => {
    const today = new Date().toISOString().split('T')[0];
    let expDate = new Date();
    const shelfLife = meta?.shelfLifeDays || 7;
    expDate.setDate(expDate.getDate() + shelfLife);

    setItemToEdit({
      id: '',
      productName: meta?.productName || `Item #${code.slice(-4)}`,
      category: meta?.category || 'Dairy & Eggs',
      quantity: 1,
      unit: meta?.unit || 'pieces',
      storageLocation: meta?.storageLocation || 'Fridge',
      manufactureDate: today,
      expiryDate: expDate.toISOString().split('T')[0],
      barcode: code,
      cost: meta?.cost || 3.99,
      dietaryType: meta?.dietaryType || 'Vegetarian',
      notes: meta?.storageTip || `Scanned Barcode: ${code}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsEditModalOpen(true);
  };

  const handleAddBoughtToInventory = (boughtItem: Partial<InventoryItem>) => {
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      id: `item_shop_${Date.now()}`,
      productName: boughtItem.productName || 'Fresh Item',
      category: boughtItem.category || 'Dairy & Eggs',
      quantity: boughtItem.quantity || 1,
      unit: boughtItem.unit || 'pieces',
      storageLocation: boughtItem.storageLocation || 'Fridge',
      manufactureDate: boughtItem.manufactureDate || now.split('T')[0],
      expiryDate: boughtItem.expiryDate || now.split('T')[0],
      cost: boughtItem.cost || 0,
      dietaryType: boughtItem.dietaryType || 'Vegetarian',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    saveInventoryItems(updated);
  };

  const handleAddShoppingItem = (item: { name: string; category?: string }) => {
    try {
      const raw = localStorage.getItem('food_tracker_shopping_list_v1');
      const list = raw ? JSON.parse(raw) : [];
      const newItem = {
        id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: item.name,
        category: item.category || 'Fresh Produce',
        quantity: 1,
        unit: 'pack',
        estimatedPrice: 2.99,
        isBought: false,
        storageLocation: 'Fridge',
        defaultShelfLifeDays: 7,
      };
      localStorage.setItem('food_tracker_shopping_list_v1', JSON.stringify([newItem, ...list]));
      window.dispatchEvent(new Event('shopping_list_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloudItemAddToInventory = (extracted: Partial<InventoryItem>) => {
    handleAddBoughtToInventory(extracted);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd'],
      });
    } catch (e) {}
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginationResult.paginatedItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBatchConsume = () => {
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    const updated = items.filter((i) => !selectedIds.includes(i.id));
    setItems(updated);
    saveInventoryItems(updated);
    setSelectedIds([]);
    setCurrentPage((prev) => getAdjustedPage(prev, updated.length, pageSize));
  };

  const handleBatchDelete = () => {
    const updated = items.filter((i) => !selectedIds.includes(i.id));
    setItems(updated);
    saveInventoryItems(updated);
    setSelectedIds([]);
    setCurrentPage((prev) => getAdjustedPage(prev, updated.length, pageSize));
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setStorageLocation('All');
    setDietaryType('All');
    setExpiringThisWeekOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative">
      {/* Background Icon Design Graphics & Ambient Animation (Food Stories & MyFitnessPal) */}
      <AnimatedBackground />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inventoryItems={items}
        userProfile={profile}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenProfile={() => setIsAuthModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onOpenEcoBadges={() => setIsEcoBadgesOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Daily 2-Day Expiry Notification Alert Banner */}
              <ExpiryNotificationBanner
                permission={permission}
                isSupported={isSupported}
                expiringWithinTwoDays={expiringWithinTwoDays}
                onRequestPermission={requestPermission}
                onTriggerTestNotification={triggerTestNotification}
                onCookExpiringItems={() => setActiveTab('recipes')}
              />

              {/* MyFitnessPal & Food Stories Daily Nutrition Target & Macro Glance */}
              <DailyMacroGlanceWidget
                onNavigateToDiet={() => setActiveTab('diet')}
                onNavigateToRecipes={() => setActiveTab('recipes')}
                onOpenScanner={() => setIsBarcodeScannerOpen(true)}
              />

              {/* Top Summary Cards */}
              <InventorySummaryCards
                items={items}
                currentStatusFilter={status}
                onFilterChange={(newStatus) => {
                  setStatus(newStatus);
                  setCurrentPage(1);
                }}
              />

              {/* Toolbar */}
              <Toolbar
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                status={status}
                onStatusChange={setStatus}
                storageLocation={storageLocation}
                onStorageLocationChange={setStorageLocation}
                dietaryType={dietaryType}
                onDietaryTypeChange={setDietaryType}
                expiringThisWeekOnly={expiringThisWeekOnly}
                onExpiringThisWeekToggle={() => setExpiringThisWeekOnly(!expiringThisWeekOnly)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenAddModal={handleOpenAddModal}
                onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
                totalFilteredCount={sortedItems.length}
              />

              {/* Batch Action Bar if items selected */}
              {selectedIds.length > 0 && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs animate-in fade-in duration-200">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                    {selectedIds.length} food items selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBatchConsume}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark All Consumed</span>
                    </button>
                    <button
                      onClick={handleBatchDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Selected</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Inventory View (Table, Grid, or Virtual Fridge) */}
              {viewMode === 'fridge' ? (
                <VirtualFridgeView
                  items={items}
                  onConsume={handleMarkConsumed}
                  onEdit={handleEditItem}
                />
              ) : viewMode === 'table' ? (
                <InventoryTable
                  items={paginationResult.paginatedItems}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                  onEdit={handleEditItem}
                  onDelete={handleDeletePrompt}
                  onConsume={handleMarkConsumed}
                  onRowClick={handleEditItem}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                <div className="space-y-4">
                  {paginationResult.paginatedItems.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-400">
                      <p>No food items match the current filters.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {paginationResult.paginatedItems.map((item) => (
                        <InventoryCard
                          key={item.id}
                          item={item}
                          isSelected={selectedIds.includes(item.id)}
                          onToggleSelect={handleToggleSelect}
                          onEdit={handleEditItem}
                          onDelete={handleDeletePrompt}
                          onConsume={handleMarkConsumed}
                          onCardClick={handleEditItem}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination Controls (for Table and Grid views) */}
              {viewMode !== 'fridge' && (
                <Pager
                  currentPage={paginationResult.currentPage}
                  totalPages={paginationResult.totalPages}
                  pageSize={paginationResult.pageSize}
                  totalItems={paginationResult.totalItems}
                  startIndex={paginationResult.startIndex}
                  endIndex={paginationResult.endIndex}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RecipeGenerator
                inventoryItems={items}
                userDietaryPreference={profile.dietaryPreference}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsDashboard items={items} />
            </motion.div>
          )}

          {activeTab === 'restock' && (
            <motion.div
              key="restock"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SmartRestockHub
                inventoryItems={items}
                onAddRestockedItem={handleAddBoughtToInventory}
              />
            </motion.div>
          )}

          {activeTab === 'diet' && (
            <motion.div
              key="diet"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DietPlansHub
                inventoryItems={items}
                onAddInventoryItem={handleAddBoughtToInventory}
                onAddShoppingItem={handleAddShoppingItem}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Cloud Scanner Button (Fixed bottom center) */}
      {!isBarcodeScannerOpen && (
        <CloudScannerHero
          onOpenScanner={() => setIsBarcodeScannerOpen(true)}
          onOpenCloudExtractor={() => {
            setCloudExtractorQuery('');
            setIsCloudExtractorOpen(true);
          }}
        />
      )}

      {/* Floating AI Assistant Trigger (Fixed bottom right) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/30 font-semibold text-xs transition-transform hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span className="hidden xs:inline">Ask Chef FreshGuard</span>
          <span className="xs:hidden">Chef AI</span>
        </button>
      )}

      {/* Modals */}
      <InventoryEditModal
        isOpen={isEditModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItem}
        onOpenScanner={() => {
          setIsEditModalOpen(false);
          setIsBarcodeScannerOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onPermanentDelete={handlePermanentDelete}
        onMarkConsumed={handleMarkConsumed}
        onMarkWasted={handleMarkWasted}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onBarcodeDetected={handleBarcodeDetected}
        onOpenCloudExtractor={() => setIsCloudExtractorOpen(true)}
      />

      <CloudDataExtractorModal
        isOpen={isCloudExtractorOpen}
        onClose={() => setIsCloudExtractorOpen(false)}
        onAddToInventory={handleCloudItemAddToInventory}
        onAddToShoppingList={handleAddShoppingItem}
        initialSearchQuery={cloudExtractorQuery}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={profile}
        onUserUpdate={setProfile}
      />

      <AiChatAssistant
        inventoryItems={items}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        onAddBoughtToInventory={handleAddBoughtToInventory}
      />

      <EcoAchievementsModal
        isOpen={isEcoBadgesOpen}
        onClose={() => setIsEcoBadgesOpen(false)}
        itemsCount={items.length}
        totalSavedDollars={items.reduce((acc, i) => acc + (i.cost || 0), 0) * 0.85}
      />
    </div>
  );
}
