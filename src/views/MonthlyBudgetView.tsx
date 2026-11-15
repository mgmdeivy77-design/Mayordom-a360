import React, { useState } from 'react';
import { PieChart, AlertTriangle, Edit3, Check, Plus, ShieldAlert } from 'lucide-react';
import { AppState, BudgetCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MonthlyBudgetViewProps {
  state: AppState;
  onUpdateBudget: (budgets: BudgetCategory[]) => void;
}

export const MonthlyBudgetView: React.FC<MonthlyBudgetViewProps> = ({
  state,
  onUpdateBudget,
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Calculate spent per category
  const categorySpent: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonthStr))
    .forEach((t) => {
      categorySpent[t.category] = (categorySpent[t.category] || 0) + t.amount;
    });

  const handleStartEdit = (cat: string, currentLimit: number) => {
    setEditingCategory(cat);
    setEditLimit(String(currentLimit));
  };

  const handleSaveEdit = (cat: string) => {
    const parsed = parseFloat(editLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      const updated = state.budgets.map((b) =>
        b.category === cat ? { ...b, limitAmount: parsed } : b
      );
      if (!updated.some((b) => b.category === cat)) {
        updated.push({ category: cat, limitAmount: parsed });
      }
      onUpdateBudget(updated);
    }
    setEditingCategory(null);
  };

  const totalBudgetLimit = state.budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpent = Object.values(categorySpent).reduce((acc, val) => acc + val, 0);
  const totalAvailable = Math.max(0, totalBudgetLimit - totalSpent);
  const totalUsage = totalBudgetLimit > 0 ? Math.round((totalSpent / totalBudgetLimit) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
          <PieChart className="w-4 h-4" />
          <span>Módulo de Presupuesto</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Presupuesto Mensual
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Establece techos de gasto por categoría, monitorea el avance y recibe alertas preventivas.
        </p>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Presupuesto Total</p>
          <p className="text-xl font-extrabold text-blue-900 dark:text-blue-100 mt-0.5">
            {formatCurrency(totalBudgetLimit)}
          </p>
        </div>

        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40">
          <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Total Gastado</p>
          <p className="text-xl font-extrabold text-rose-900 dark:text-rose-100 mt-0.5">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            Disponible Remanente
          </p>
          <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
            {formatCurrency(totalAvailable)}
          </p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">% Ejecutado</p>
          <p className="text-xl font-extrabold text-amber-900 dark:text-amber-100 mt-0.5">
            {totalUsage}%
          </p>
        </div>
      </div>

      {/* Category Progress List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          Límites y Ejecución por Categoría
        </h3>

        <div className="space-y-4">
          {state.budgets.map((b) => {
            const spent = categorySpent[b.category] || 0;
            const available = b.limitAmount - spent;
            const percentage = b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0;
            const isExceeded = spent > b.limitAmount;
            const isNearLimit = percentage >= 85 && !isExceeded;

            return (
              <div
                key={b.category}
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
                          value={editLimit}
                          onChange={(e) => setEditLimit(e.target.value)}
                          className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border rounded font-bold text-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(b.category)}
                          className="p-1 bg-emerald-600 text-white rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
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
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Gastado: {formatCurrency(spent)} ({percentage}%)</span>
                  <span>
                    {available >= 0
                      ? `Disponible: ${formatCurrency(available)}`
                      : `Excedido por: ${formatCurrency(Math.abs(available))}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
