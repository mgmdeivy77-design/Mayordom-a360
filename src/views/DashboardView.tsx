import React from 'react';
import {
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Calendar,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { AppState, Transaction } from '../types';
import { calculateFinancialTotals, formatCurrency, formatDate } from '../utils/formatters';

interface DashboardViewProps {
  state: AppState;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  setActiveTab,
  onNavigate,
  onOpenQuickAdd,
}) => {
  const navigateTo = (tab: string) => {
    const tabMap: Record<string, string> = {
      aiAssistant: 'ai-intelligence',
      savingsGoals: 'savings-goals',
      monthlyBudget: 'monthly-budget',
      annualBudget: 'annual-budget',
      shoppingList: 'shopping-list',
      emergencyFund: 'emergency-fund',
      stewardship: 'christian-stewardship',
      products: 'product-catalog',
      priceComparator: 'price-comparator',
      weeklyMenu: 'weekly-menu',
      inventory: 'home-inventory',
      statistics: 'advanced-stats',
      bankIntegration: 'settings',
    };
    const target = tabMap[tab] || tab;
    if (onNavigate) onNavigate(target);
    if (setActiveTab) setActiveTab(target);
  };

  const totals = calculateFinancialTotals(state);

  // Key metric cards
  const cards = [
    {
      title: 'Dinero Disponible',
      amount: formatCurrency(totals.availableCash),
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
      tab: 'incomes',
      badge: 'Líquido En Bancos',
    },
    {
      title: 'Ingresos del Mes',
      amount: formatCurrency(totals.totalIncome),
      icon: ArrowUpRight,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
      tab: 'incomes',
      badge: 'Entradas DOP$',
    },
    {
      title: 'Gastos del Mes',
      amount: formatCurrency(totals.totalExpense),
      icon: ArrowDownRight,
      color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
      tab: 'expenses',
      badge: `${totals.budgetUsagePercentage}% Presupuesto`,
    },
    {
      title: 'Ahorros Acumulados',
      amount: formatCurrency(totals.totalSavings),
      icon: PiggyBank,
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
      tab: 'savingsGoals',
      badge: 'Metas Activas',
    },
    {
      title: 'Inversiones Renta',
      amount: formatCurrency(totals.totalInvestments),
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
      tab: 'investments',
      badge: 'Títulos & Fondos',
    },
    {
      title: 'Deudas Pendientes',
      amount: formatCurrency(totals.totalDebts),
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
      tab: 'debts',
      badge: 'Saldo Por Saldar',
    },
    {
      title: 'Patrimonio Neto',
      amount: formatCurrency(totals.netWorth),
      icon: ShieldCheck,
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      tab: 'statistics',
      badge: 'Activos - Pasivos',
    },
    {
      title: 'Gasto Diario Promedio',
      amount: formatCurrency(totals.dailyAverageExpense),
      icon: Receipt,
      color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
      tab: 'expenses',
      badge: 'Ritmo Diario',
    },
  ];

  // Weekly cashflow computed dynamically from recorded transactions
  const cashflowWeeks = [
    { name: 'Semana 1', Ingresos: 0, Gastos: 0 },
    { name: 'Semana 2', Ingresos: 0, Gastos: 0 },
    { name: 'Semana 3', Ingresos: 0, Gastos: 0 },
    { name: 'Semana 4', Ingresos: 0, Gastos: 0 },
  ];

  state.transactions.forEach((tx) => {
    const day = parseInt(tx.date.slice(8, 10), 10) || 1;
    const weekIndex = Math.min(3, Math.floor((day - 1) / 8));
    if (tx.type === 'income') {
      cashflowWeeks[weekIndex].Ingresos += tx.amount;
    } else {
      cashflowWeeks[weekIndex].Gastos += tx.amount;
    }
  });
  const cashflowData = cashflowWeeks;

  // Expenses category pie chart data
  const categoryTotals: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  const COLORS = ['#1e3a8a', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0284c7', '#4b5563'];

  // Principal focus savings goal
  const focusGoal = state.savingsGoals[0];

  // Upcoming payments
  const upcomingEvents = state.calendarEvents.filter((e) => !e.isPaid).slice(0, 4);

  // Step-by-step progress indicators
  const hasIncome = state.transactions.some((t) => t.type === 'income');
  const hasExpense = state.transactions.some((t) => t.type === 'expense');
  const hasBudget = state.budgets.length > 0;
  const hasGoals = state.savingsGoals.length > 0;

  const budgetSteps = [
    {
      step: 'Paso 1',
      title: 'Registra tus Ingresos',
      desc: 'Define tus fuentes y categorías de entrada.',
      done: hasIncome,
      tab: 'incomes',
    },
    {
      step: 'Paso 2',
      title: 'Categorías y Gastos',
      desc: 'Edita o añade tus categorías de gasto.',
      done: hasExpense,
      tab: 'expenses',
    },
    {
      step: 'Paso 3',
      title: 'Crea tu Presupuesto',
      desc: 'Configura límites Semanal, Mensual o Anual.',
      done: hasBudget,
      tab: 'monthlyBudget',
    },
    {
      step: 'Paso 4',
      title: 'Metas y Fondo',
      desc: 'Protege tu hogar con ahorro planificado.',
      done: hasGoals,
      tab: 'savingsGoals',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-[11px] sm:text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>República Dominicana • Mayordomía Financiera</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Resumen General de Finanzas
          </h1>
          <p className="text-blue-100/80 text-xs sm:text-sm mt-1 max-w-xl">
            Control de ingresos, gastos, ahorro en supermercados y metas para la prosperidad familiar.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('aiAssistant')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>Diagnóstico Mayordomo AI</span>
          </button>
          <button
            onClick={onOpenQuickAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm backdrop-blur-md transition-all"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Registrar Movimiento</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Budget Setup Guide */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Crea tu Presupuesto Paso a Paso (Semanal, Mensual o Anual)
            </h2>
            <p className="text-xs text-slate-500">
              Sigue estos 4 pasos en orden para organizar las finanzas de tu hogar desde cero.
            </p>
          </div>
          <button
            onClick={() => navigateTo('monthlyBudget')}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Ir al Constructor de Presupuesto
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {budgetSteps.map((item) => (
            <button
              key={item.step}
              onClick={() => navigateTo(item.tab)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                item.done
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {item.step}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.done ? 'Listo' : 'Pendiente'}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 8 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => navigateTo(card.tab)}
              className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group min-w-0"
            >
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${card.color}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight bg-slate-100 dark:bg-slate-800 px-1.5 sm:px-2 py-0.5 rounded-md truncate">
                  {card.badge}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5 truncate">
                  {card.title}
                </p>
                <p className="text-sm sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tabular-nums truncate">
                  {card.amount}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Focus Savings Goal & Budget Usage Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Focus Goal */}
        {focusGoal ? (
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 rounded-xl">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Meta Principal de Ahorro
                  </h3>
                  <p className="text-xs text-slate-500">{focusGoal.title}</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('savingsGoals')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Ver Todas
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">
                  {formatCurrency(focusGoal.currentAmount)}
                </span>
                <span className="text-slate-900 dark:text-white">
                  Objetivo: {formatCurrency(focusGoal.targetAmount)}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      focusGoal.targetAmount > 0
                        ? Math.min(
                            100,
                            Math.round((focusGoal.currentAmount / focusGoal.targetAmount) * 100)
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>
                  Progreso:{' '}
                  {focusGoal.targetAmount > 0
                    ? Math.round((focusGoal.currentAmount / focusGoal.targetAmount) * 100)
                    : 0}
                  %
                </span>
                <span>Aporte rec.: {formatCurrency(focusGoal.recommendedMonthlyContribution)}/mes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 rounded-xl">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Sin Metas de Ahorro Aún
                </h3>
                <p className="text-xs text-slate-500">Define tu primera meta familiar.</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('savingsGoals')}
              className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Crear Primera Meta
            </button>
          </div>
        )}

        {/* Budget Execution Gauge */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Ejecución Presupuesto Mensual
              </h3>
              <button
                onClick={() => navigateTo('monthlyBudget')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Detalles
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Monto ejecutado respecto a límites por categorías.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">
                  {formatCurrency(totals.totalExpense)}
                </span>
                <span className="text-slate-900 dark:text-white">
                  {totals.budgetUsagePercentage}% Utilizado
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totals.budgetUsagePercentage > 90
                      ? 'bg-rose-600'
                      : totals.budgetUsagePercentage > 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, totals.budgetUsagePercentage)}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            {totals.budgetUsagePercentage < 80
              ? '✅ Excelente control presupuestario este mes.'
              : '⚠️ Atención: Estás cerca del límite asignado.'}
          </p>
        </div>

        {/* Dominican Supermarket Shopping Quick Card */}
        <div className="p-5 bg-gradient-to-br from-emerald-900 to-teal-950 rounded-2xl text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Compras Inteligentes RD</h3>
            </div>
            <p className="text-xs text-emerald-100/80 mb-4">
              Compara ofertas en Bravo, La Sirena, Nacional, Jumbo, Olé y PriceSmart.
            </p>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <p className="text-xs text-emerald-200">
                💡 Tip de Mayordomía:
              </p>
              <p className="text-xs font-medium text-white mt-0.5">
                Ahorra hasta RD$ 2,500 comprando víveres criollos en días de oferta.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('shoppingList')}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
          >
            Ver Lista de Compras
          </button>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Cashflow Area Chart */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 sm:mb-4">
            Flujo de Caja Semanal (Ingresos vs Gastos)
          </h3>
          <div className="h-52 sm:h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} width={48} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Ingresos"
                  stroke="#059669"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="Gastos"
                  stroke="#dc2626"
                  fill="#ef4444"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 sm:mb-4">
            Distribución de Gastos por Categoría
          </h3>
          <div className="h-52 sm:h-64 flex items-center justify-center min-w-0">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">Sin gastos registrados</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Payments & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Payments */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 min-w-0">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Próximos Pagos</span>
            </h3>
            <button
              onClick={() => navigateTo('calendar')}
              className="text-xs text-blue-600 font-semibold hover:underline shrink-0"
            >
              Ver Calendario
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay pagos pendientes.</p>
            ) : (
              upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Vence: {formatDate(evt.date)}
                    </p>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-xs sm:text-sm shrink-0 tabular-nums">
                    {evt.amount ? formatCurrency(evt.amount) : 'Pendiente'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Movements */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
              Últimos Movimientos
            </h3>
            <button
              onClick={() => navigateTo('expenses')}
              className="text-xs text-blue-600 font-semibold hover:underline shrink-0"
            >
              Ver Todos
            </button>
          </div>

          <div className="space-y-2.5">
            {state.transactions.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Aún no has registrado ingresos ni gastos.
                </p>
                <button
                  onClick={onOpenQuickAdd}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                >
                  Registrar Primer Movimiento
                </button>
              </div>
            ) : (
              state.transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {formatDate(tx.date)} • {tx.category} ({tx.account})
                    </p>
                  </div>
                  <span
                    className={`font-bold text-xs sm:text-sm shrink-0 tabular-nums ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
