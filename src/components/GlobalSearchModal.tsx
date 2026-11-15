import React, { useState, useMemo } from 'react';
import { Search, X, Receipt, Package, CreditCard, Target, ArrowRight } from 'lucide-react';
import { AppState } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
  state: AppState;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen = true,
  onClose,
  state,
  setActiveTab,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  const navigateTo = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
    onClose();
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const txMatches = state.transactions
      .filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.account.toLowerCase().includes(q) ||
          (t.store && t.store.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((t) => ({
        type: 'transaction',
        title: t.description,
        subtitle: `${formatDate(t.date)} • ${t.category} (${t.account})`,
        amount: formatCurrency(t.amount),
        tab: t.type === 'income' ? 'incomes' : 'expenses',
      }));

    const prodMatches = state.products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => ({
        type: 'product',
        title: p.name,
        subtitle: `Categoría: ${p.category}`,
        amount: p.pricesByStore['Bravo'] ? formatCurrency(p.pricesByStore['Bravo']) : 'Varias tiendas',
        tab: 'product-catalog',
      }));

    const debtMatches = state.debts
      .filter((d) => d.creditor.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({
        type: 'debt',
        title: d.creditor,
        subtitle: `Saldo pendiente: ${formatCurrency(d.currentBalance)}`,
        amount: formatCurrency(d.monthlyPayment) + '/mes',
        tab: 'debts',
      }));

    const goalMatches = state.savingsGoals
      .filter((g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
      .slice(0, 3)
      .map((g) => ({
        type: 'goal',
        title: g.title,
        subtitle: `Acumulado: ${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)}`,
        amount: `${g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0}%`,
        tab: 'savings-goals',
      }));

    return [...txMatches, ...prodMatches, ...debtMatches, ...goalMatches];
  }, [query, state]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar movimientos, productos, metas..."
            className="flex-1 min-w-0 bg-transparent border-none outline-hidden text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="max-h-[70dvh] sm:max-h-96 overflow-y-auto p-2">
          {!query.trim() && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Escribe palabras clave para buscar en todos los registros financieros...
            </div>
          )}

          {query.trim() && searchResults.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No se encontraron coincidencias para "{query}".
            </div>
          )}

          {searchResults.map((item, index) => (
            <button
              key={index}
              onClick={() => navigateTo(item.tab)}
              className="w-full flex items-center justify-between gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                  {item.type === 'transaction' && <Receipt className="w-4 h-4" />}
                  {item.type === 'product' && <Package className="w-4 h-4" />}
                  {item.type === 'debt' && <CreditCard className="w-4 h-4" />}
                  {item.type === 'goal' && <Target className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tabular-nums">
                  {item.amount}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
