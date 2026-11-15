import React from 'react';
import { AlertTriangle, Clock, Calendar, ShieldAlert, X, ArrowRight } from 'lucide-react';
import { AppState } from '../types';
import { calculateFinancialTotals, formatCurrency, formatDate } from '../utils/formatters';

interface SmartAlertsBannerProps {
  isOpen?: boolean;
  onClose?: () => void;
  state: AppState;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const SmartAlertsBanner: React.FC<SmartAlertsBannerProps> = ({
  isOpen,
  onClose,
  state,
  setActiveTab,
  onNavigate,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  const navigateTo = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
    if (onClose) onClose();
  };

  if (isOpen === false || (isOpen === undefined && dismissed)) return null;

  const totals = calculateFinancialTotals(state);

  const alerts = [];

  // Budget exceed check
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const categoryExpenses: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonthStr))
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  state.budgets.forEach((b) => {
    const spent = categoryExpenses[b.category] || 0;
    if (spent > b.limitAmount) {
      alerts.push({
        type: 'budget',
        title: `Presupuesto superado en ${b.category}`,
        message: `Has gastado ${formatCurrency(spent)} de un límite de ${formatCurrency(b.limitAmount)}.`,
        tab: 'monthly-budget',
      });
    }
  });

  // Upcoming unpaid events in next 7 days
  const todayStr = now.toISOString().slice(0, 10);
  const upcomingEvents = state.calendarEvents.filter(
    (e) => !e.isPaid && e.date >= todayStr
  );

  upcomingEvents.forEach((e) => {
    alerts.push({
      type: 'event',
      title: `Pago Próximo: ${e.title}`,
      message: `Vence el ${formatDate(e.date)} ${e.amount ? `por ${formatCurrency(e.amount)}` : ''}.`,
      tab: 'calendar',
    });
  });

  // Expiring inventory items in pantry (< 7 days)
  state.inventory.forEach((item) => {
    if (item.expirationDate) {
      const expDate = new Date(item.expirationDate);
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 7) {
        alerts.push({
          type: 'inventory',
          title: `Producto por vencer: ${item.name}`,
          message: diffDays < 0 ? '¡Ya ha vencido!' : `Vence en ${diffDays} días (${formatDate(item.expirationDate)}).`,
          tab: 'home-inventory',
        });
      }
    }
  });

  // Debts payment day reminder
  state.debts.forEach((d) => {
    if (now.getDate() >= d.dueDateDay - 3 && now.getDate() <= d.dueDateDay) {
      alerts.push({
        type: 'debt',
        title: `Vencimiento de Deuda: ${d.creditor}`,
        message: `Cuota mensual de ${formatCurrency(d.monthlyPayment)} el día ${d.dueDateDay} del mes.`,
        tab: 'debts',
      });
    }
  });

  if (alerts.length === 0 && isOpen === undefined) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setDismissed(true);
    }
  };

  // If rendered as modal (isOpen explicit)
  if (isOpen === true) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150">
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-base">
              <ShieldAlert className="w-5 h-5" />
              <span>Alertas Inteligentes Mayordomo RD</span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto space-y-3">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                ✨ No tienes alertas financieras críticas activas en este momento. ¡Excelente mayordomía!
              </div>
            ) : (
              alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo(alert.tab)}
                    className="px-2.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                  >
                    Ver <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rendered as inline banner at top of workspace
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Alertas Activas ({alerts.length})</span>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          title="Cerrar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 text-xs"
          >
            <div className="flex items-center gap-2.5 overflow-hidden mr-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {alert.title}:
              </span>
              <span className="text-slate-600 dark:text-slate-400 truncate hidden sm:inline">
                {alert.message}
              </span>
            </div>
            <button
              onClick={() => navigateTo(alert.tab)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 flex items-center gap-0.5 text-xs"
            >
              Ver <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
