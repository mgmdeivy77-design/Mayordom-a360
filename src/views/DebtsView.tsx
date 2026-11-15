import React, { useState } from 'react';
import { CreditCard, Plus, Calculator, Trash2, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { AppState, Debt, DebtType } from '../types';
import { calculateFrenchAmortization, formatCurrency } from '../utils/formatters';

interface DebtsViewProps {
  state: AppState;
  onAddDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  state,
  onAddDebt,
  onDeleteDebt,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAmortizationDebt, setSelectedAmortizationDebt] = useState<Debt | null>(null);

  // Form
  const [creditor, setCreditor] = useState('');
  const [type, setType] = useState<DebtType>('Banco');
  const [originalAmount, setOriginalAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRateAnnual, setInterestRateAnnual] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDateDay, setDueDateDay] = useState('10');
  const [totalMonths, setTotalMonths] = useState('36');
  const [notes, setNotes] = useState('');

  const debtTypes: DebtType[] = [
    'Banco',
    'Tarjeta',
    'Préstamo',
    'Hipoteca',
    'Vehículo',
    'Prestamista',
    'Familiares',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = parseFloat(originalAmount);
    const curr = parseFloat(currentBalance) || orig;
    const rate = parseFloat(interestRateAnnual) || 0;
    const pmt = parseFloat(monthlyPayment) || 0;
    const day = parseInt(dueDateDay) || 10;
    const months = parseInt(totalMonths) || 12;

    if (!creditor || isNaN(orig) || orig <= 0) return;

    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      type,
      creditor,
      originalAmount: orig,
      currentBalance: curr,
      interestRateAnnual: rate,
      monthlyPayment: pmt,
      dueDateDay: day,
      totalPaid: orig - curr,
      totalMonths: months,
      remainingMonths: Math.max(1, Math.round(curr / (pmt || 1))),
      notes,
    };

    onAddDebt(newDebt);
    setCreditor('');
    setOriginalAmount('');
    setCurrentBalance('');
    setShowAddModal(false);
  };

  const totalDebtsBalance = state.debts.reduce((acc, d) => acc + d.currentBalance, 0);
  const totalMonthlyCommitments = state.debts.reduce((acc, d) => acc + d.monthlyPayment, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Módulo de Pasivos y Deudas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Control & Eliminación de Deudas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo de préstamos bancarios, tarjetas, prestamistas, hipotecas y simulador de amortización.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Deuda
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Saldo Total Pendiente</p>
            <p className="text-xl sm:text-2xl font-extrabold text-rose-900 dark:text-rose-100 mt-0.5 tabular-nums truncate">
              {formatCurrency(totalDebtsBalance)}
            </p>
          </div>
          <div className="p-2.5 sm:p-3 bg-rose-600 text-white rounded-xl shrink-0">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Compromiso Cuotas Mensuales</p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-900 dark:text-amber-100 mt-0.5 tabular-nums truncate">
              {formatCurrency(totalMonthlyCommitments)}/mes
            </p>
          </div>
          <div className="p-2.5 sm:p-3 bg-amber-600 text-white rounded-xl shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Debts Grid */}
      {state.debts.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No tienes deudas registradas.
          </p>
          <p className="text-xs text-slate-400">
            Si tienes préstamos o tarjetas, regístralos aquí para simular su tabla de amortización.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            + Registrar Deuda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.debts.map((debt) => {
            const progressPct =
              debt.originalAmount > 0
                ? Math.min(
                    100,
                    Math.round(((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100)
                  )
                : 0;

            return (
              <div
                key={debt.id}
                className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {debt.type}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1 truncate">
                      {debt.creditor}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteDebt(debt.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                    title="Eliminar deuda"
                    aria-label="Eliminar deuda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <div>
                      <span className="text-xs text-slate-400">Saldo Pendiente</span>
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(debt.currentBalance)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Cuota Fija</span>
                      <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                        {formatCurrency(debt.monthlyPayment)}/mes
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 tabular-nums">
                    <span>Saldado: {progressPct}%</span>
                    <span>Monto Orig.: {formatCurrency(debt.originalAmount)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    <span>Tasa: </span>
                    <strong className="text-slate-900 dark:text-white tabular-nums">
                      {debt.interestRateAnnual}% anual
                    </strong>
                    <span> • Vence día {debt.dueDateDay}</span>
                  </div>

                  <button
                    onClick={() => setSelectedAmortizationDebt(debt)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline min-h-[36px]"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Simular Tabla
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Amortization Table Modal */}
      {selectedAmortizationDebt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90dvh] flex flex-col pb-safe">
            <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Tabla de Amortización Francesa
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {selectedAmortizationDebt.creditor} ({formatCurrency(selectedAmortizationDebt.currentBalance)} a {selectedAmortizationDebt.interestRateAnnual}% anual)
                </p>
              </div>
              <button
                onClick={() => setSelectedAmortizationDebt(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold shrink-0"
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-auto flex-1 my-3 sm:my-4">
              <table className="w-full text-left text-[11px] sm:text-xs min-w-[440px]">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold sticky top-0">
                  <tr>
                    <th className="p-2 sm:p-2.5">Mes</th>
                    <th className="p-2 sm:p-2.5">Cuota Fija</th>
                    <th className="p-2 sm:p-2.5">Interés</th>
                    <th className="p-2 sm:p-2.5">Abono Capital</th>
                    <th className="p-2 sm:p-2.5 text-right">Saldo Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculateFrenchAmortization(
                    selectedAmortizationDebt.currentBalance,
                    selectedAmortizationDebt.interestRateAnnual,
                    selectedAmortizationDebt.remainingMonths || 24
                  ).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold">Mes {row.month}</td>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(row.payment)}
                      </td>
                      <td className="p-2.5 text-rose-600">{formatCurrency(row.interest)}</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">{formatCurrency(row.principal)}</td>
                      <td className="p-2.5 text-right font-extrabold">{formatCurrency(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Nueva Deuda / Préstamo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Acreedor / Institución *
                </label>
                <input
                  type="text"
                  value={creditor}
                  onChange={(e) => setCreditor(e.target.value)}
                  placeholder="ej. Banco Popular, Banreservas, Prestamista..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Deuda
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DebtType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    {debtTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Día de Pago del Mes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDateDay}
                    onChange={(e) => setDueDateDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Original (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={originalAmount}
                    onChange={(e) => setOriginalAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Pendiente (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    placeholder="Igual al original si es nuevo"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tasa Interés Anual (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRateAnnual}
                    onChange={(e) => setInterestRateAnnual(e.target.value)}
                    placeholder="ej. 13.5"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cuota Mensual (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    placeholder="ej. 11400"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs"
                >
                  Guardar Deuda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
