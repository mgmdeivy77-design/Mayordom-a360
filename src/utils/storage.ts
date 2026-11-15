import { AppState } from '../types';
import { initialAppState } from '../data/initialData';

const STORAGE_KEY = 'mayordomo_rd_app_state_v1';
const PIN_SESSION_KEY = 'mayordomo_rd_pin_unlocked';

export const loadAppState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveAppState(initialAppState);
      return initialAppState;
    }
    const parsed = JSON.parse(data) as any;
    // Merge deep settings and ensure arrays are valid
    return {
      ...initialAppState,
      ...parsed,
      transactions: Array.isArray(parsed?.transactions) ? parsed.transactions : initialAppState.transactions,
      budgets: Array.isArray(parsed?.budgets) ? parsed.budgets : initialAppState.budgets,
      calendarEvents: Array.isArray(parsed?.calendarEvents) ? parsed.calendarEvents : initialAppState.calendarEvents,
      savingsGoals: Array.isArray(parsed?.savingsGoals) ? parsed.savingsGoals : initialAppState.savingsGoals,
      investments: Array.isArray(parsed?.investments) ? parsed.investments : initialAppState.investments,
      debts: Array.isArray(parsed?.debts) ? parsed.debts : initialAppState.debts,
      products: Array.isArray(parsed?.products) ? parsed.products : initialAppState.products,
      shoppingList: Array.isArray(parsed?.shoppingList) ? parsed.shoppingList : initialAppState.shoppingList,
      weeklyMenu: Array.isArray(parsed?.weeklyMenu) ? parsed.weeklyMenu : initialAppState.weeklyMenu,
      inventory: Array.isArray(parsed?.inventory) ? parsed.inventory : initialAppState.inventory,
      stewardship: Array.isArray(parsed?.stewardship)
        ? parsed.stewardship
        : Array.isArray(parsed?.stewardshipRecords)
        ? parsed.stewardshipRecords
        : initialAppState.stewardship || [],
      badges: Array.isArray(parsed?.badges) ? parsed.badges : initialAppState.badges || [],
      settings: {
        ...initialAppState.settings,
        ...(parsed?.settings || {}),
      },
      profile: {
        ...initialAppState.profile,
        ...(parsed?.profile || {}),
      },
    };
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
  downloadAnchor.setAttribute('download', `Mayordomo_Familiar_RD_Respaldo_${new Date().toISOString().slice(0, 10)}.json`);
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
