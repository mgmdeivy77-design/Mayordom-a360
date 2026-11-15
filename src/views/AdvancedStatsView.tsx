import React from 'react';
import { PieChart as PieChartIcon, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { AppState } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AdvancedStatsViewProps {
  state: AppState;
}

export const AdvancedStatsView: React.FC<AdvancedStatsViewProps> = ({ state }) => {
  // Expense by category data
  const categoryMap: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryPieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Store expense distribution
  const storeMap: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense' && t.store)
    .forEach((t) => {
      if (t.store) storeMap[t.store] = (storeMap[t.store] || 0) + t.amount;
    });

  const storeBarData = Object.entries(storeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#059669', '#dc2626', '#2563eb', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#475569'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
          <PieChartIcon className="w-4 h-4 shrink-0" />
          <span>Módulo de Analítica Financiera</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Estadísticas Avanzadas & Distribución
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Visualización de patrones de gasto, distribución por supermercado y proporción de la canasta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Pie Chart */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-3 sm:mb-4">
            Distribución de Gastos por Categoría
          </h3>
          <div className="h-64 sm:h-72 min-w-0 flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center">
                Registra gastos para ver la distribución por categoría.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={72}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Supermarket Bar Chart */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-3 sm:mb-4">
            Gasto Acumulado por Supermercado (RD$)
          </h3>
          <div className="h-64 sm:h-72 min-w-0 flex items-center justify-center">
            {storeBarData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center">
                Registra gastos con supermercado seleccionado para ver la comparativa.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeBarData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} width={48} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
