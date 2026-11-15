import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { AppState } from '../types';
import { calculateFinancialTotals, formatCurrency } from '../utils/formatters';

interface EmergencyFundViewProps {
  state: AppState;
  onUpdateEmergencyGoalMonths: (months: 3 | 6 | 9 | 12) => void;
}

export const EmergencyFundView: React.FC<EmergencyFundViewProps> = ({
  state,
  onUpdateEmergencyGoalMonths,
}) => {
  const totals = calculateFinancialTotals(state);

  // Average monthly expense baseline
  const monthlyExpense = Math.max(45000, totals.totalExpense || 85000);

  // Emergency goal from savings goals or state
  const emergencyGoal = state.savingsGoals.find((g) => g.category === 'Emergencia');
  const currentFund = emergencyGoal ? emergencyGoal.currentAmount : 245000;

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

  const progressPct = Math.min(100, Math.round((currentFund / selectedTarget) * 100));
  const missingAmount = Math.max(0, selectedTarget - currentFund);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Módulo de Escudo Financiero</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Fondo de Emergencia Familiar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cálculo automático de reservas líquidas para imprevistos de salud, empleo o contingencias en RD$.
        </p>
      </div>

      {/* Target Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Selecciona la Meta de Cobertura Deseada
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                <div className="text-xs opacity-90">{item.label}</div>
                <div className="text-base font-extrabold mt-1">{formatCurrency(item.amount)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Status Display */}
      <div className="p-6 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Estado del Fondo ({selectedMonths} Meses de Gastos)
            </span>
            <h2 className="text-3xl font-extrabold mt-2">
              {formatCurrency(currentFund)}
            </h2>
            <p className="text-emerald-100/80 text-xs mt-1">
              Monto objetivo actual: {formatCurrency(selectedTarget)} (basado en gasto mensual de {formatCurrency(monthlyExpense)})
            </p>
          </div>

          <div className="text-right">
            <span className="text-4xl font-extrabold text-emerald-400">{progressPct}%</span>
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
          <div className="flex justify-between text-xs text-emerald-200 font-medium">
            <span>
              {missingAmount > 0
                ? `Faltan ${formatCurrency(missingAmount)} para completar tu meta.`
                : '🎉 ¡Fondo de emergencia 100% completado!'}
            </span>
            <span>Aporte mensual sugerido: {formatCurrency(Math.round(missingAmount / 12))}/mes</span>
          </div>
        </div>
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
