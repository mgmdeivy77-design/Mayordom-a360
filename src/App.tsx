import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Transaction, CalendarEvent, SavingsGoal, Investment, Debt, ShoppingListItem, Product, HomeInventoryItem, DayMenu, StewardshipRecord, BudgetCategory } from './types';
import { loadAppState, saveAppState, setPinUnlocked } from './utils/storage';
import { initialAppState } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SmartAlertsBanner } from './components/SmartAlertsBanner';
import { PinModal } from './components/PinModal';
import { QuickAddTransactionModal } from './components/QuickAddTransactionModal';

// Views
import { DashboardView } from './views/DashboardView';
import { IncomesView } from './views/IncomesView';
import { ExpensesView } from './views/ExpensesView';
import { MonthlyBudgetView } from './views/MonthlyBudgetView';
import { AnnualBudgetView } from './views/AnnualBudgetView';
import { CalendarView } from './views/CalendarView';
import { SavingsGoalsView } from './views/SavingsGoalsView';
import { EmergencyFundView } from './views/EmergencyFundView';
import { InvestmentsView } from './views/InvestmentsView';
import { DebtsView } from './views/DebtsView';
import { ShoppingListView } from './views/ShoppingListView';
import { ProductCatalogView } from './views/ProductCatalogView';
import { PriceComparatorView } from './views/PriceComparatorView';
import { WeeklyMenuView } from './views/WeeklyMenuView';
import { HomeInventoryView } from './views/HomeInventoryView';
import { ChristianStewardshipView } from './views/ChristianStewardshipView';
import { ReportsView } from './views/ReportsView';
import { AdvancedStatsView } from './views/AdvancedStatsView';
import { FinancialCalculatorsView } from './views/FinancialCalculatorsView';
import { GeminiAIIntelligenceView } from './views/GeminiAIIntelligenceView';
import { FinancialEducationView } from './views/FinancialEducationView';
import { UserGuideView } from './views/UserGuideView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState() || initialAppState);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => state.settings.theme === 'dark');

  // PIN security lock
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => !state.settings.pinEnabled);

  // Sync state to localstorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Handle Android PWA home screen shortcuts (?action=quick-add, ?view=...) and Ctrl+K search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const actionParam = params.get('action');

    if (viewParam) {
      setActiveView(viewParam);
    }
    if (actionParam === 'quick-add') {
      setQuickAddModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dark mode effect + dynamic Android status bar theme-color
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDarkMode ? '#0f172a' : '#1e3a8a');
    }
  }, [isDarkMode]);

  const alertCount = useMemo(() => {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = now.toISOString().slice(0, 10);

    const categoryExpenses: Record<string, number> = {};
    state.transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonthStr))
      .forEach((t) => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    const budgetAlerts = state.budgets.filter(
      (b) => (!b.period || b.period === 'monthly') && (categoryExpenses[b.category] || 0) > b.limitAmount
    ).length;

    const eventAlerts = state.calendarEvents.filter(
      (e) => !e.isPaid && e.date >= todayStr
    ).length;

    const inventoryAlerts = state.inventory.filter((item) => {
      if (!item.expirationDate) return false;
      const diffDays = Math.ceil(
        (new Date(item.expirationDate).getTime() - now.getTime()) / (1000 * 3600 * 24)
      );
      return diffDays <= 7;
    }).length;

    const debtAlerts = state.debts.filter(
      (d) => now.getDate() >= d.dueDateDay - 3 && now.getDate() <= d.dueDateDay
    ).length;

    return budgetAlerts + eventAlerts + inventoryAlerts + debtAlerts;
  }, [state.transactions, state.budgets, state.calendarEvents, state.inventory, state.debts]);

  const toggleDarkMode = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: nextTheme },
    }));
  };

  // Transaction Handlers
  const handleAddTransaction = (tx: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [tx, ...prev.transactions],
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  // Editable & Addable Category Handlers (Income & Expense)
  const handleAddCategory = (kind: 'income' | 'expense', name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      const key = kind === 'income' ? 'incomeCategories' : 'expenseCategories';
      const existing = prev.settings[key] || [];
      if (existing.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        settings: {
          ...prev.settings,
          [key]: [...existing, trimmed],
        },
      };
    });
  };

  const handleRenameCategory = (kind: 'income' | 'expense', oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    setState((prev) => {
      const key = kind === 'income' ? 'incomeCategories' : 'expenseCategories';
      const existing = prev.settings[key] || [];
      const updatedCategories = existing.map((c) => (c === oldName ? trimmed : c));

      const updatedTransactions = prev.transactions.map((t) =>
        t.type === kind && t.category === oldName ? { ...t, category: trimmed } : t
      );

      const updatedBudgets =
        kind === 'expense'
          ? prev.budgets.map((b) => (b.category === oldName ? { ...b, category: trimmed } : b))
          : prev.budgets;

      return {
        ...prev,
        transactions: updatedTransactions,
        budgets: updatedBudgets,
        settings: {
          ...prev.settings,
          [key]: updatedCategories,
        },
      };
    });
  };

  const handleDeleteCategory = (kind: 'income' | 'expense', name: string) => {
    setState((prev) => {
      const key = kind === 'income' ? 'incomeCategories' : 'expenseCategories';
      const existing = prev.settings[key] || [];
      if (existing.length <= 1) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          [key]: existing.filter((c) => c !== name),
        },
      };
    });
  };

  // Budget Handler
  const handleUpdateBudget = (budgets: BudgetCategory[]) => {
    setState((prev) => ({ ...prev, budgets }));
  };

  // Emergency Fund Handler
  const handleUpdateEmergencyGoalMonths = (months: 3 | 6 | 9 | 12) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, emergencyFundMonthsGoal: months },
    }));
  };

  // Savings Goal Handlers
  const handleAddSavingsGoal = (goal: SavingsGoal) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, goal],
    }));
  };

  const handleUpdateGoalAmount = (id: string, amountToAdd: number) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === id ? { ...g, currentAmount: g.currentAmount + amountToAdd } : g
      ),
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
  };

  // Calendar Event Handlers
  const handleAddCalendarEvent = (evt: CalendarEvent) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, evt],
    }));
  };

  const handleToggleEventPaid = (id: string) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map((e) =>
        e.id === id ? { ...e, isPaid: !e.isPaid } : e
      ),
    }));
  };

  const handleDeleteEvent = (id: string) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e) => e.id !== id),
    }));
  };

  // Investment Handlers
  const handleAddInvestment = (inv: Investment) => {
    setState((prev) => ({
      ...prev,
      investments: [...prev.investments, inv],
    }));
  };

  const handleDeleteInvestment = (id: string) => {
    setState((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id),
    }));
  };

  // Debt Handlers
  const handleAddDebt = (debt: Debt) => {
    setState((prev) => ({
      ...prev,
      debts: [...prev.debts, debt],
    }));
  };

  const handleDeleteDebt = (id: string) => {
    setState((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== id),
    }));
  };

  // Shopping List Handlers
  const handleAddShoppingItem = (item: ShoppingListItem) => {
    setState((prev) => ({
      ...prev,
      shoppingList: [...prev.shoppingList, item],
    }));
  };

  const handleToggleShoppingItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleDeleteShoppingItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.filter((item) => item.id !== id),
    }));
  };

  const handleClearCheckedShoppingItems = () => {
    setState((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.filter((item) => !item.checked),
    }));
  };

  const handleClearAllShoppingItems = () => {
    setState((prev) => ({
      ...prev,
      shoppingList: [],
    }));
  };

  // Product Catalog Handlers
  const handleAddProduct = (prod: Product) => {
    setState((prev) => ({
      ...prev,
      products: [...prev.products, prod],
    }));
  };

  const handleDeleteProduct = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  // Weekly Menu Handlers
  const handleUpdateWeeklyMenu = (menu: DayMenu[]) => {
    setState((prev) => ({ ...prev, weeklyMenu: menu }));
  };

  const handleAddIngredientsToShoppingList = (ingredients: string[]) => {
    const newItems: ShoppingListItem[] = ingredients.map((ing, i) => ({
      id: `shop-ing-${Date.now()}-${i}`,
      name: ing,
      category: 'Alimentos',
      store: 'Bravo',
      quantity: 1,
      unit: 'unidad',
      estimatedUnitPrice: 0,
      checked: false,
    }));

    setState((prev) => ({
      ...prev,
      shoppingList: [...prev.shoppingList, ...newItems],
    }));

    setActiveView('shopping-list');
  };

  // Inventory Handlers
  const handleAddInventoryItem = (item: HomeInventoryItem) => {
    setState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
  };

  const handleDeleteInventoryItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => i.id !== id),
    }));
  };

  // Christian Stewardship Handlers
  const handleAddStewardshipRecord = (record: StewardshipRecord) => {
    setState((prev) => ({
      ...prev,
      stewardship: [record, ...(prev.stewardship || [])],
    }));
  };

  const handleDeleteStewardshipRecord = (id: string) => {
    setState((prev) => ({
      ...prev,
      stewardship: (prev.stewardship || []).filter((r) => r.id !== id),
    }));
  };

  // Render current view
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            state={state}
            onNavigate={(view) => setActiveView(view)}
            onOpenQuickAdd={() => setQuickAddModalOpen(true)}
          />
        );
      case 'incomes':
        return (
          <IncomesView
            state={state}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'expenses':
        return (
          <ExpensesView
            state={state}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'monthly-budget':
        return (
          <MonthlyBudgetView
            state={state}
            onUpdateBudget={handleUpdateBudget}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      case 'annual-budget':
        return (
          <AnnualBudgetView
            state={state}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            state={state}
            onAddCalendarEvent={handleAddCalendarEvent}
            onToggleEventPaid={handleToggleEventPaid}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'savings-goals':
        return (
          <SavingsGoalsView
            state={state}
            onAddSavingsGoal={handleAddSavingsGoal}
            onUpdateGoalAmount={handleUpdateGoalAmount}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'emergency-fund':
        return (
          <EmergencyFundView
            state={state}
            onUpdateEmergencyGoalMonths={handleUpdateEmergencyGoalMonths}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      case 'investments':
        return (
          <InvestmentsView
            state={state}
            onAddInvestment={handleAddInvestment}
            onDeleteInvestment={handleDeleteInvestment}
          />
        );
      case 'debts':
        return (
          <DebtsView
            state={state}
            onAddDebt={handleAddDebt}
            onDeleteDebt={handleDeleteDebt}
          />
        );
      case 'shopping-list':
        return (
          <ShoppingListView
            state={state}
            onAddShoppingItem={handleAddShoppingItem}
            onToggleShoppingItem={handleToggleShoppingItem}
            onDeleteShoppingItem={handleDeleteShoppingItem}
            onClearCheckedShoppingItems={handleClearCheckedShoppingItems}
            onClearAllShoppingItems={handleClearAllShoppingItems}
          />
        );
      case 'product-catalog':
        return (
          <ProductCatalogView
            state={state}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'price-comparator':
        return <PriceComparatorView state={state} />;
      case 'weekly-menu':
        return (
          <WeeklyMenuView
            state={state}
            onUpdateWeeklyMenu={handleUpdateWeeklyMenu}
            onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
          />
        );
      case 'home-inventory':
        return (
          <HomeInventoryView
            state={state}
            onAddInventoryItem={handleAddInventoryItem}
            onDeleteInventoryItem={handleDeleteInventoryItem}
          />
        );
      case 'christian-stewardship':
        return (
          <ChristianStewardshipView
            state={state}
            onAddStewardshipRecord={handleAddStewardshipRecord}
            onDeleteStewardshipRecord={handleDeleteStewardshipRecord}
          />
        );
      case 'reports':
        return <ReportsView state={state} />;
      case 'user-guide':
        return <UserGuideView onNavigate={(view) => setActiveView(view)} />;
      case 'advanced-stats':
        return <AdvancedStatsView state={state} />;
      case 'calculators':
        return <FinancialCalculatorsView />;
      case 'ai-intelligence':
        return <GeminiAIIntelligenceView state={state} />;
      case 'education':
        return <FinancialEducationView />;
      case 'settings':
        return (
          <SettingsView
            state={state}
            onUpdateState={(newState) => setState(newState)}
          />
        );
      default:
        return (
          <DashboardView
            state={state}
            onNavigate={(view) => setActiveView(view)}
            onOpenQuickAdd={() => setQuickAddModalOpen(true)}
          />
        );
    }
  };

  if (!isPinUnlocked && state.settings.pinEnabled) {
    return (
      <PinModal
        correctPin={state.settings.securityPin || '1234'}
        onSuccess={() => setIsPinUnlocked(true)}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-x-clip">
      {/* Navbar */}
      <Navbar
        state={state}
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenQuickAdd={() => setQuickAddModalOpen(true)}
        onOpenAlerts={() => setAlertsModalOpen(true)}
        alertCount={alertCount}
        onLockApp={() => {
          setPinUnlocked(false);
          setIsPinUnlocked(false);
        }}
      />

      <div className="flex flex-1 min-w-0">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={(view) => setActiveView(view)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          state={state}
          enableChristianStewardship={state.settings.enableStewardshipModule}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          <SmartAlertsBanner state={state} onNavigate={(view) => setActiveView(view)} />
          {renderView()}
        </main>
      </div>

      {/* Android Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        onOpenQuickAdd={() => setQuickAddModalOpen(true)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Alerts Modal triggered from Navbar Bell */}
      {alertsModalOpen && (
        <SmartAlertsBanner
          isOpen={true}
          onClose={() => setAlertsModalOpen(false)}
          state={state}
          onNavigate={(view) => setActiveView(view)}
        />
      )}

      {/* Global Search Modal */}
      {searchModalOpen && (
        <GlobalSearchModal
          state={state}
          onClose={() => setSearchModalOpen(false)}
          onNavigate={(view) => setActiveView(view)}
        />
      )}

      {/* Quick Add Transaction Modal */}
      {quickAddModalOpen && (
        <QuickAddTransactionModal
          state={state}
          onClose={() => setQuickAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
