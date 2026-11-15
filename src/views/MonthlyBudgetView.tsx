import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  Edit3,
  Check,
  Plus,
  ShieldAlert,
  Trash2,
  Tag,
  Wand2,
  Copy,
  X,
} from 'lucide-react';
import { AppState, BudgetCategory, BudgetPeriod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CategoryManagerModal } from '../components/CategoryManagerModal';

interface MonthlyBudgetViewProps {
  state: AppState;
  onUpdateBudget: (budgets: BudgetCategory[]) => void;
  onAddCategory: (kind: 'income' | 'expense', name: string) => void;
  onRenameCategory: (kind: 'income' | 'expense', oldName: string, newName: string) => void;
  onDeleteCategory: (kind: 'income' | 'expense', name: string) => void;
  onNavigate?: (view: string) => void;
}

const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  annual: 'Anual',
};

export const MonthlyBudgetView: React.FC<MonthlyBudgetViewProps> = ({
  state,
  onUpdateBudget,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onNavigate,
}) => {
  const [period, setPeriod] = useState<BudgetPeriod>(
    state.settings.preferredBudgetPeriod || 'monthly'
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');
  const [showAddCategoryLimitModal, setShowAddCategoryLimitModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const expenseCategories =
    state.settings.expenseCategories && state.settings.expenseCategories.length > 0
      ? state.settings.expenseCategories
      : ['Alimentos', 'Otros'];

  const now = new Date();
  const currentYearStr = String(now.getFullYear());
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Calculate current week bounds (Monday-Sunday)
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const startWeekStr = startOfWeek.toISOString().slice(0, 10);
  const endWeekStr = endOfWeek.toISOString().slice(0, 10);

  const matchesPeriod = (dateStr: string) => {
    if (period === 'weekly') {
      return dateStr >= startWeekStr && dateStr <= endWeekStr;
    }
    if (period === 'annual') {
      return dateStr.startsWith(currentYearStr);
    }
    return dateStr.startsWith(currentMonthStr);
  };

  // Period income & expenses
  const periodIncome = state.transactions
    .filter((t) => t.type === 'income' && matchesPeriod(t.date))
    .reduce((acc, t) => acc + t.amount, 0);

  const categorySpent: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense' && matchesPeriod(t.date))
    .forEach((t) => {
      categorySpent[t.category] = (categorySpent[t.category] || 0) + t.amount;
    });

  // Budgets matching active period (default legacy items to 'monthly')
  const periodBudgets = state.budgets.filter((b) => (b.period || 'monthly') === period);
  const otherPeriodBudgets = state.budgets.filter((b) => (b.period || 'monthly') !== period);
  const monthlyBudgets = state.budgets.filter((b) => (b.period || 'monthly') === 'monthly');

  const handleStartEdit = (cat: string, currentLimit: number) => {
    setEditingCategory(cat);
    setEditLimit(String(currentLimit));
  };

  const handleSaveEdit = (cat: string) => {
    const parsed = parseFloat(editLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      const updatedCurrent = periodBudgets.map((b) =>
        b.category === cat ? { ...b, limitAmount: parsed, period } : b
      );
      if (!updatedCurrent.some((b) => b.category === cat)) {
        updatedCurrent.push({ category: cat, limitAmount: parsed, period });
      }
      onUpdateBudget([...otherPeriodBudgets, ...updatedCurrent]);
    }
    setEditingCategory(null);
  };

  const handleDeleteBudgetCategory = (cat: string) => {
    const updatedCurrent = periodBudgets.filter((b) => b.category !== cat);
    onUpdateBudget([...otherPeriodBudgets, ...updatedCurrent]);
  };

  const handleClearPeriodBudget = () => {
    onUpdateBudget(otherPeriodBudgets);
    setConfirmClearOpen(false);
  };

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newBudgetCategory || expenseCategories[0];
    const limit = parseFloat(newBudgetLimit);
    if (!cat || isNaN(limit) || limit < 0) return;

    const existing = periodBudgets.some((b) => b.category === cat);
    const updatedCurrent = existing
      ? periodBudgets.map((b) => (b.category === cat ? { ...b, limitAmount: limit, period } : b))
      : [...periodBudgets, { category: cat, limitAmount: limit, period }];

    onUpdateBudget([...otherPeriodBudgets, ...updatedCurrent]);
    setNewBudgetLimit('');
    setShowAddCategoryLimitModal(false);
  };

  const handleAutoCreateFromCategories = () => {
    // Distribute 80% of periodIncome across key categories (or create 0-limit entries so user just edits)
    const baseIncome = periodIncome;
    const existingCats = new Set(periodBudgets.map((b) => b.category));
    const toAdd: BudgetCategory[] = expenseCategories
      .filter((c) => !existingCats.has(c))
      .map((c, idx, arr) => ({
        category: c,
        limitAmount:
          baseIncome > 0 && arr.length > 0 ? Math.round((baseIncome * 0.8) / arr.length) : 0,
        period,
      }));
    onUpdateBudget([...state.budgets, ...toAdd]);
  };

  const handleCopyFromMonthly = () => {
    if (monthlyBudgets.length === 0) return;
    const factor = period === 'weekly' ? 1 / 4.33 : period === 'annual' ? 12 : 1;
    const scaled: BudgetCategory[] = monthlyBudgets.map((b) => ({
      category: b.category,
      limitAmount: Math.round(b.limitAmount * factor),
      period,
    }));
    onUpdateBudget([...otherPeriodBudgets, ...scaled]);
  };

  const totalBudgetLimit = periodBudgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpent = Object.values(categorySpent).reduce((acc, val) => acc + val, 0);
  const totalAvailable = Math.max(0, totalBudgetLimit - totalSpent);
  const totalUsage = totalBudgetLimit > 0 ? Math.round((totalSpent / totalBudgetLimit) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header + Period Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <PieChart className="w-4 h-4 shrink-0" />
              <span>Paso 3 • Constructor de Presupuesto</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Presupuesto {PERIOD_LABELS[period]}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Arma tu presupuesto semanal, mensual o anual en 3 pasos simples usando tus categorías personalizadas.
            </p>
          </div>

          {/* Period Switcher */}
          <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['weekly', 'monthly', 'annual'] as BudgetPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPeriod(p);
                  setEditingCategory(null);
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Step Mini Builder Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                1. Ingresos del Período
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(periodIncome)}
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('incomes')}
                className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
              >
                + Ingreso
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCategoryManager(true)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-500 text-left flex items-center justify-between gap-2 transition-colors"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                2. Categorías Editables
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {expenseCategories.length} categorías configuradas
              </p>
            </div>
            <Tag className="w-4 h-4 text-blue-600 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              setNewBudgetCategory(expenseCategories[0] || '');
              setShowAddCategoryLimitModal(true);
            }}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-left flex items-center justify-between gap-2 transition-colors shadow-sm"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-100">
                3. Asignar Límite
              </span>
              <p className="text-xs font-bold">Añadir categoría al presupuesto</p>
            </div>
            <Plus className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium truncate">
            Presupuesto {PERIOD_LABELS[period]}
          </p>
          <p className="text-base sm:text-xl font-extrabold text-blue-900 dark:text-blue-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalBudgetLimit)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-rose-700 dark:text-rose-300 font-medium truncate">
            Total Gastado
          </p>
          <p className="text-base sm:text-xl font-extrabold text-rose-900 dark:text-rose-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-medium truncate">
            Disponible Remanente
          </p>
          <p className="text-base sm:text-xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalAvailable)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 font-medium truncate">
            % Ejecutado
          </p>
          <p className="text-base sm:text-xl font-extrabold text-amber-900 dark:text-amber-100 mt-0.5 tabular-nums truncate">
            {totalUsage}%
          </p>
        </div>
      </div>

      {/* Category Progress List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            Límites y Ejecución por Categoría ({PERIOD_LABELS[period]})
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {period !== 'monthly' && monthlyBudgets.length > 0 && (
              <button
                type="button"
                onClick={handleCopyFromMonthly}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100"
              >
                <Copy className="w-3.5 h-3.5" />
                Escalar desde Mensual
              </button>
            )}
            <button
              type="button"
              onClick={handleAutoCreateFromCategories}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Cargar Todas mis Categorías
            </button>
            {periodBudgets.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar Período
              </button>
            )}
          </div>
        </div>

        {periodBudgets.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Aún no has definido límites para tu presupuesto {PERIOD_LABELS[period].toLowerCase()}.
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Haz clic en "Añadir categoría al presupuesto" o en "Cargar Todas mis Categorías" para crear tu plantilla rápidamente.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNewBudgetCategory(expenseCategories[0] || '');
                  setShowAddCategoryLimitModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                + Añadir Primera Categoría
              </button>
              <button
                type="button"
                onClick={handleAutoCreateFromCategories}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Cargar Todas las Categorías
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {periodBudgets.map((b) => {
              const spent = categorySpent[b.category] || 0;
              const available = b.limitAmount - spent;
              const percentage = b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0;
              const isExceeded = b.limitAmount > 0 && spent > b.limitAmount;
              const isNearLimit = percentage >= 85 && !isExceeded;

              return (
                <div
                  key={`${period}-${b.category}`}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {b.category}
                      </span>
                      {isExceeded && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 px-2 py-0.5 rounded text-[10px] font-extrabold">
                          <AlertTriangle className="w-3 h-3" /> Límite Excedido
                        </span>
                      )}
                      {isNearLimit && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-extrabold">
                          <ShieldAlert className="w-3 h-3" /> Cerca del Límite
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {editingCategory === b.category ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editLimit}
                            onChange={(e) => setEditLimit(e.target.value)}
                            className="w-28 px-2 py-1 bg-white dark:bg-slate-900 border border-blue-500 rounded font-bold text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(b.category)}
                            className="p-1.5 bg-emerald-600 text-white rounded"
                            title="Guardar límite"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">
                            Límite:{' '}
                            <strong className="text-slate-900 dark:text-white">
                              {formatCurrency(b.limitAmount)}
                            </strong>
                          </span>
                          <button
                            onClick={() => handleStartEdit(b.category, b.limitAmount)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Editar límite"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudgetCategory(b.category)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Eliminar categoría del presupuesto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-600'
                          : percentage > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                      <div className="flex justify-between items-center gap-2 text-[11px] text-slate-500 pt-1 tabular-nums">
                        <span className="truncate">
                          Gastado: {formatCurrency(spent)} ({percentage}%)
                        </span>
                        <span className="shrink-0">
                          {available >= 0
                            ? `Disp.: ${formatCurrency(available)}`
                            : `Excedido: ${formatCurrency(Math.abs(available))}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

      {/* Add Category Limit Modal */}
      {showAddCategoryLimitModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Asignar Límite al Presupuesto {PERIOD_LABELS[period]}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Elige una de tus categorías de gasto y define el tope máximo.
            </p>
            <form onSubmit={handleAddBudgetItem} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Categoría de Gasto
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategoryLimitModal(false);
                      setShowCategoryManager(true);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    + Crear o editar categorías
                  </button>
                </div>
                <select
                  value={newBudgetCategory || expenseCategories[0]}
                  onChange={(e) => setNewBudgetCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  {expenseCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Límite {PERIOD_LABELS[period]} (RD$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  placeholder="ej. 15000"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryLimitModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Guardar Límite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Clear Period Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              ¿Vaciar presupuesto {PERIOD_LABELS[period].toLowerCase()}?
            </h3>
            <p className="text-xs text-slate-500">
              Se eliminarán todas las categorías asignadas al período {PERIOD_LABELS[period].toLowerCase()}. Tus gastos registrados no se borrarán.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearPeriodBudget}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Sí, vaciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        initialTab="expense"
        state={state}
        onAddCategory={onAddCategory}
        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};
