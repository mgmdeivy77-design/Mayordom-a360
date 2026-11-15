import React, { useState } from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AppState } from '../types';
import { formatCurrency, getMonthName } from '../utils/formatters';

interface AnnualBudgetViewProps {
  state: AppState;
  onNavigate?: (view: string) => void;
}

export const AnnualBudgetView: React.FC<AnnualBudgetViewProps> = ({ state, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const [viewMode, setViewMode] = useState<'actual' | 'projected'>('actual');

  // Compute baseline from user's real configured monthly/annual budgets and current month's income
  const monthlyBudgetLimit = state.budgets
    .filter((b) => (b.period || 'monthly') === 'monthly')
    .reduce((acc, b) => acc + b.limitAmount, 0);

  const annualBudgetLimit = state.budgets
    .filter((b) => b.period === 'annual')
    .reduce((acc, b) => acc + b.limitAmount, 0);

  const baselineMonthlyExpense =
    monthlyBudgetLimit > 0
      ? monthlyBudgetLimit
      : annualBudgetLimit > 0
      ? Math.round(annualBudgetLimit / 12)
      : 0;

  const currentYearIncomes = state.transactions.filter(
    (t) => t.type === 'income' && t.date.startsWith(String(currentYear))
  );
  const monthsWithIncome = new Set(currentYearIncomes.map((t) => t.date.slice(0, 7))).size;
  const baselineMonthlyIncome =
    monthsWithIncome > 0
      ? Math.round(
          currentYearIncomes.reduce((acc, t) => acc + t.amount, 0) / monthsWithIncome
        )
      : 0;

  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = String(i + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthNum}`;

    const monthIncomes = state.transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(prefix))
      .reduce((acc, t) => acc + t.amount, 0);

    const monthExpenses = state.transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(prefix))
      .reduce((acc, t) => acc + t.amount, 0);

    const income =
      viewMode === 'projected' && monthIncomes === 0 ? baselineMonthlyIncome : monthIncomes;
    const expense =
      viewMode === 'projected' && monthExpenses === 0 ? baselineMonthlyExpense : monthExpenses;
    const savings = Math.max(0, income - expense);

    return {
      month: getMonthName(i),
      monthIndex: i,
      Ingresos: income,
      Gastos: expense,
      Ahorro: savings,
    };
  });

  const totalAnnualIncome = monthsData.reduce((acc, m) => acc + m.Ingresos, 0);
  const totalAnnualExpense = monthsData.reduce((acc, m) => acc + m.Gastos, 0);
  const totalAnnualSavings = monthsData.reduce((acc, m) => acc + m.Ahorro, 0);
  const avgMonthlySavings = Math.round(totalAnnualSavings / 12);

  const hasAnyData =
    state.transactions.some((t) => t.date.startsWith(String(currentYear))) ||
    baselineMonthlyExpense > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Paso 4 • Presupuesto Anual</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Consolidado & Proyección Anual {currentYear}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculado exclusivamente a partir de tus ingresos, gastos y presupuestos configurados.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setViewMode('actual')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
              viewMode === 'actual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Datos Reales
          </button>
          <button
            type="button"
            onClick={() => setViewMode('projected')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
              viewMode === 'projected'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Proyección Presupuesto
          </button>
        </div>
      </div>

      {!hasAnyData && (
        <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-3xl border border-dashed border-indigo-300 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-indigo-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Sin movimientos ni presupuesto base todavía
              </h3>
              <p className="text-xs text-slate-500">
                Registra tus ingresos y configura tu presupuesto semanal o mensual para ver la proyección anual de los 12 meses.
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('monthly-budget')}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shrink-0"
            >
              Configurar Presupuesto
            </button>
          )}
        </div>
      )}

      {/* Annual KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium truncate">
            {viewMode === 'actual' ? 'Ingresos Registrados' : 'Ingresos Proyectados'}
          </p>
          <p className="text-base sm:text-xl font-extrabold text-blue-900 dark:text-blue-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalAnnualIncome)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-rose-700 dark:text-rose-300 font-medium truncate">
            {viewMode === 'actual' ? 'Gastos Registrados' : 'Gastos Proyectados'}
          </p>
          <p className="text-base sm:text-xl font-extrabold text-rose-900 dark:text-rose-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalAnnualExpense)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-medium truncate">
            Capacidad Ahorro Anual
          </p>
          <p className="text-base sm:text-xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalAnnualSavings)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 min-w-0">
          <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 font-medium truncate">
            Ahorro Promedio Mensual
          </p>
          <p className="text-base sm:text-xl font-extrabold text-amber-900 dark:text-amber-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(avgMonthlySavings)}
          </p>
        </div>
      </div>

      {/* Annual Bar Chart */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-4">
          Comparativa Mensual de Ingresos y Gastos
        </h3>
        <div className="h-56 sm:h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthsData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} width={48} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Ingresos" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ahorro" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Tabla Desglosada Mes a Mes ({currentYear})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] sm:text-sm tabular-nums">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-2.5 sm:p-4">Mes</th>
                <th className="p-2.5 sm:p-4">Ingresos</th>
                <th className="p-2.5 sm:p-4">Gastos</th>
                <th className="p-2.5 sm:p-4">Ahorro</th>
                <th className="p-2.5 sm:p-4 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthsData.map((m) => {
                const marginPct = m.Ingresos > 0 ? Math.round((m.Ahorro / m.Ingresos) * 100) : 0;
                return (
                  <tr key={m.month} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 sm:p-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {m.month}
                    </td>
                    <td className="p-2.5 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(m.Ingresos)}
                    </td>
                    <td className="p-2.5 sm:p-4 font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                      {formatCurrency(m.Gastos)}
                    </td>
                    <td className="p-2.5 sm:p-4 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(m.Ahorro)}
                    </td>
                    <td className="p-2.5 sm:p-4 text-right whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs">
                        {marginPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
