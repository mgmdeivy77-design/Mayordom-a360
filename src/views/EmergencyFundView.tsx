import React, { useState } from 'react';
import { Shield, ShieldAlert, PiggyBank } from 'lucide-react';
import { AppState } from '../types';
import { calculateFinancialTotals, formatCurrency } from '../utils/formatters';

interface EmergencyFundViewProps {
  state: AppState;
  onUpdateEmergencyGoalMonths: (months: 3 | 6 | 9 | 12) => void;
  onNavigate?: (view: string) => void;
}

export const EmergencyFundView: React.FC<EmergencyFundViewProps> = ({
  state,
  onUpdateEmergencyGoalMonths,
  onNavigate,
}) => {
  const totals = calculateFinancialTotals(state);
  const [customMonthlyBaseline, setCustomMonthlyBaseline] = useState('');

  const monthlyBudgetTotal = state.budgets
    .filter((b) => (b.period || 'monthly') === 'monthly')
    .reduce((acc, b) => acc + b.limitAmount, 0);

  const parsedCustom = parseFloat(customMonthlyBaseline);
  const detectedMonthlyExpense =
    totals.totalExpense > 0 ? totals.totalExpense : monthlyBudgetTotal;
  const monthlyExpense =
    !isNaN(parsedCustom) && parsedCustom > 0 ? parsedCustom : detectedMonthlyExpense;

  const emergencyGoal = state.savingsGoals.find((g) => g.category === 'Emergencia');
  const currentFund = emergencyGoal ? emergencyGoal.currentAmount : 0;

  const target3Months = monthlyExpense * 3;
  const target6Months = monthlyExpense * 6;
  const target9Months = monthlyExpense * 9;
  const target12Months = monthlyExpense * 12;

  const selectedMonths = state.settings.emergencyFundMonthsGoal || 6;
  const selectedTarget =
    selectedMonths === 3
      ? target3Months
      : selectedMonths === 6
      ? target6Months
      : selectedMonths === 9
      ? target9Months
      : target12Months;

  const progressPct =
    selectedTarget > 0 ? Math.min(100, Math.round((currentFund / selectedTarget) * 100)) : 0;
  const missingAmount = Math.max(0, selectedTarget - currentFund);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4 shrink-0" />
          <span>Paso 6 • Escudo Financiero</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Fondo de Emergencia Familiar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Calculado con tus gastos o presupuesto mensual real, y vinculado a tu meta de ahorro en categoría "Emergencia".
        </p>
      </div>

      {/* Monthly Expense Baseline */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Gasto Mensual Base para el Cálculo
          </h3>
          <p className="text-xs text-slate-500">
            {detectedMonthlyExpense > 0
              ? `Detectado automáticamente de tus datos: ${formatCurrency(detectedMonthlyExpense)}/mes.`
              : 'Aún no hay gastos o presupuesto mensual; puedes ingresar un estimado temporal abajo.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500">Estimado manual (RD$):</span>
          <input
            type="number"
            min="0"
            value={customMonthlyBaseline}
            onChange={(e) => setCustomMonthlyBaseline(e.target.value)}
            placeholder={detectedMonthlyExpense > 0 ? String(detectedMonthlyExpense) : '0'}
            className="w-full sm:w-32 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none tabular-nums"
          />
        </div>
      </div>

      {/* Target Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Selecciona la Meta de Cobertura Deseada
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { months: 3 as const, amount: target3Months, label: '3 Meses (Básico)' },
            { months: 6 as const, amount: target6Months, label: '6 Meses (Recomendado)' },
            { months: 9 as const, amount: target9Months, label: '9 Meses (Protegido)' },
            { months: 12 as const, amount: target12Months, label: '12 Meses (Inquebrantable)' },
          ].map((item) => {
            const isSelected = selectedMonths === item.months;
            return (
              <button
                key={item.months}
                onClick={() => onUpdateEmergencyGoalMonths(item.months)}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all min-w-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                <div className="text-[11px] sm:text-xs opacity-90 truncate">{item.label}</div>
                <div className="text-sm sm:text-base font-extrabold mt-1 tabular-nums truncate">{formatCurrency(item.amount)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Status Display */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl sm:rounded-3xl shadow-xl space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase">
              Estado del Fondo ({selectedMonths} Meses de Gastos)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tabular-nums">{formatCurrency(currentFund)}</h2>
            <p className="text-emerald-100/80 text-xs mt-1">
              Monto objetivo actual: {formatCurrency(selectedTarget)} (basado en gasto mensual de{' '}
              {formatCurrency(monthlyExpense)})
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums">{progressPct}%</span>
            <p className="text-xs text-emerald-200">Cubierto</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-emerald-950/60 h-4 rounded-full overflow-hidden border border-emerald-500/30 p-0.5">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-emerald-200 font-medium">
            <span>
              {selectedTarget === 0
                ? 'Registra gastos o un presupuesto mensual para calcular tu meta.'
                : missingAmount > 0
                ? `Faltan ${formatCurrency(missingAmount)} para completar tu meta.`
                : '🎉 ¡Fondo de emergencia 100% completado!'}
            </span>
            <span>
              Aporte mensual sugerido: {formatCurrency(Math.round(missingAmount / 12))}/mes
            </span>
          </div>
        </div>

        {!emergencyGoal && onNavigate && (
          <div className="pt-2 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-emerald-100">
              Crea una meta en "Metas de Ahorro" con categoría <strong>Emergencia</strong> para registrar tus depósitos aquí.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('savings-goals')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shrink-0"
            >
              <PiggyBank className="w-4 h-4" />
              Crear Meta de Emergencia
            </button>
          </div>
        )}
      </div>

      {/* Financial Security Advice */}
      <div className="p-5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
        <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          Recomendación de Almacenamiento Seguro en RD
        </h4>
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          Guarda este dinero en instrumentos con liquidez inmediata en República Dominicana, como{' '}
          <strong>Fondos Abiertos de Renta Fija en Puestos de Bolsa (AFI)</strong> o cuentas de ahorro
          de alto rendimiento supervisadas por la Superintendencia de Bancos (SB). Nunca lo inviertas
          en activos de riesgo o de difícil acceso.
        </p>
      </div>
    </div>
  );
};
