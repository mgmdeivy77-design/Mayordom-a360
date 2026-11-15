import { AppState } from '../types';
import {
  initialAppState,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES,
} from '../data/initialData';

const STORAGE_KEY = 'mayordomo_rd_app_state_v2';
const PIN_SESSION_KEY = 'mayordomo_rd_pin_unlocked';

const mergeUniqueCategories = (base: string[], extra?: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of [...base, ...(Array.isArray(extra) ? extra : [])]) {
    const trimmed = typeof item === 'string' ? item.trim() : '';
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
};

export const normalizeAppState = (raw: any): AppState => {
  const rawSettings = raw?.settings || {};

  const incomeCategories = Array.isArray(rawSettings.incomeCategories)
    ? mergeUniqueCategories(rawSettings.incomeCategories, rawSettings.customIncomeCategories)
    : mergeUniqueCategories(DEFAULT_INCOME_CATEGORIES, rawSettings.customIncomeCategories);

  const expenseCategories = Array.isArray(rawSettings.expenseCategories)
    ? mergeUniqueCategories(rawSettings.expenseCategories, rawSettings.customExpenseCategories)
    : mergeUniqueCategories(DEFAULT_EXPENSE_CATEGORIES, rawSettings.customExpenseCategories);

  return {
    ...initialAppState,
    ...raw,
    transactions: Array.isArray(raw?.transactions) ? raw.transactions : initialAppState.transactions,
    budgets: Array.isArray(raw?.budgets) ? raw.budgets : initialAppState.budgets,
    calendarEvents: Array.isArray(raw?.calendarEvents) ? raw.calendarEvents : initialAppState.calendarEvents,
    savingsGoals: Array.isArray(raw?.savingsGoals) ? raw.savingsGoals : initialAppState.savingsGoals,
    investments: Array.isArray(raw?.investments) ? raw.investments : initialAppState.investments,
    debts: Array.isArray(raw?.debts) ? raw.debts : initialAppState.debts,
    products: Array.isArray(raw?.products) ? raw.products : initialAppState.products,
    shoppingList: Array.isArray(raw?.shoppingList) ? raw.shoppingList : initialAppState.shoppingList,
    weeklyMenu:
      Array.isArray(raw?.weeklyMenu) && raw.weeklyMenu.length === 7
        ? raw.weeklyMenu
        : initialAppState.weeklyMenu,
    inventory: Array.isArray(raw?.inventory) ? raw.inventory : initialAppState.inventory,
    stewardship: Array.isArray(raw?.stewardship)
      ? raw.stewardship
      : Array.isArray(raw?.stewardshipRecords)
      ? raw.stewardshipRecords
      : initialAppState.stewardship,
    badges: Array.isArray(raw?.badges) ? raw.badges : initialAppState.badges,
    settings: {
      ...initialAppState.settings,
      ...rawSettings,
      incomeCategories,
      expenseCategories,
      customIncomeCategories: Array.isArray(rawSettings.customIncomeCategories)
        ? rawSettings.customIncomeCategories
        : [],
      customExpenseCategories: Array.isArray(rawSettings.customExpenseCategories)
        ? rawSettings.customExpenseCategories
        : [],
    },
    profile: {
      ...initialAppState.profile,
      ...(raw?.profile || {}),
    },
  };
};

export const loadAppState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveAppState(initialAppState);
      return initialAppState;
    }
    const parsed = JSON.parse(data);
    return normalizeAppState(parsed);
  } catch (err) {
    console.error('Error loading app state from LocalStorage:', err);
    return initialAppState;
  }
};

export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving app state to LocalStorage:', err);
  }
};

export const resetAppStateToDefault = (): AppState => {
  saveAppState(initialAppState);
  return initialAppState;
};

export const exportAppStateAsJson = (state: AppState): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `Mayordomo_Familiar_RD_Respaldo_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const checkIsPinUnlocked = (): boolean => {
  return sessionStorage.getItem(PIN_SESSION_KEY) === 'true';
};

export const setPinUnlocked = (unlocked: boolean): void => {
  if (unlocked) {
    sessionStorage.setItem(PIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(PIN_SESSION_KEY);
  }
};
