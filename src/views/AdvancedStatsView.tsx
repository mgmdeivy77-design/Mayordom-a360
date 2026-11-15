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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <PieChartIcon className="w-4 h-4" />
          <span>Módulo de Analítica Financiera</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Estadísticas Avanzadas & Distribución
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Visualización de patrones de gasto, distribución por supermercado y proporción de la canasta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
            Distribución de Gastos por Categoría
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supermarket Bar Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
            Gasto Acumulado por Supermercado (RD$)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeBarData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
