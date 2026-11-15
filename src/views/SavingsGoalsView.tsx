import React, { useState } from 'react';
import { Target, Plus, PiggyBank, PlusCircle, Trash2, Home, Car, GraduationCap, Palmtree, ShieldAlert, Laptop, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState, SavingsGoal } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SavingsGoalsViewProps {
  state: AppState;
  onAddSavingsGoal: (goal: SavingsGoal) => void;
  onUpdateGoalAmount: (id: string, amountToAdd: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  state,
  onAddSavingsGoal,
  onUpdateGoalAmount,
  onDeleteGoal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('2027-12-31');
  const [recommendedMonthlyContribution, setRecommendedMonthlyContribution] = useState('');
  const [category, setCategory] = useState('Casa');

  const categories = ['Casa', 'Vehículo', 'Universidad', 'Vacaciones', 'Emergencia', 'Computadora', 'Otro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount) || 0;
    const parsedRec = parseFloat(recommendedMonthlyContribution) || Math.round(parsedTarget / 12);

    if (!title || isNaN(parsedTarget) || parsedTarget <= 0) return;

    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title,
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      estimatedDate,
      recommendedMonthlyContribution: parsedRec,
      category,
      icon: category === 'Casa' ? 'Home' : category === 'Vehículo' ? 'Car' : 'Target',
    };

    onAddSavingsGoal(newGoal);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setShowAddModal(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const added = parseFloat(depositAmount);
    if (!isNaN(added) && added > 0) {
      onUpdateGoalAmount(depositModalGoal.id, added);

      // Launch Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setDepositModalGoal(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 shrink-0" />
            <span>Módulo de Metas de Ahorro</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Propósitos Financieros Familiares
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planes de vivienda, vehículo, educación, fondo de contingencia y vacaciones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Meta de Ahorro
        </button>
      </div>

      {/* Goals Grid */}
      {state.savingsGoals.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Aún no has creado ninguna meta de ahorro.
          </p>
          <p className="text-xs text-slate-400">
            Crea metas para tu Fondo de Emergencia, vivienda, vehículo o educación familiar.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
          >
            + Crear Primera Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.savingsGoals.map((goal) => {
            const percentage =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shrink-0">
                      <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                        {goal.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-1 truncate">
                        {goal.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                    title="Eliminar Meta"
                    aria-label="Eliminar Meta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amounts and Progress */}
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold tabular-nums">
                      Meta: {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 tabular-nums">
                    <span>Progreso: {percentage}%</span>
                    <span>Faltan: {formatCurrency(remaining)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    <span>Aporte rec.: </span>
                    <strong className="text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(goal.recommendedMonthlyContribution)}/mes
                    </strong>
                  </div>

                  <button
                    onClick={() => setDepositModalGoal(goal)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-transform active:scale-95 min-h-[38px]"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Abonar Dinero
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Abonar a {depositModalGoal.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa el monto a depositar a tu meta de ahorro en DOP$.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monto a Abonar (RD$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="ej. 5000"
                  required
                  autoFocus
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Confirmar Aporte 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Nueva Meta de Ahorro
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Meta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Pronto Pago Casa, Vehículo, Estudio..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Objetivo (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Actual (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Estimada
                  </label>
                  <input
                    type="date"
                    value={estimatedDate}
                    onChange={(e) => setEstimatedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Aporte Recomendado Mensual (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={recommendedMonthlyContribution}
                  onChange={(e) => setRecommendedMonthlyContribution(e.target.value)}
                  placeholder="Calculado automáticamente si está vacío"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
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
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Crear Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
