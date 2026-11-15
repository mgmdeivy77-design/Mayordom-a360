import React, { useState } from 'react';
import { HeartHandshake, Plus, Sparkles, Trash2 } from 'lucide-react';
import { AppState, StewardshipRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ChristianStewardshipViewProps {
  state: AppState;
  onAddStewardshipRecord: (record: StewardshipRecord) => void;
  onDeleteStewardshipRecord: (id: string) => void;
}

export const ChristianStewardshipView: React.FC<ChristianStewardshipViewProps> = ({
  state,
  onAddStewardshipRecord,
  onDeleteStewardshipRecord,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [type, setType] = useState<'tithe' | 'offering' | 'firstfruit' | 'charity'>('tithe');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('Iglesia Local');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Calculate total monthly income to compute recommended 10% tithe
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthIncomes = state.transactions
    .filter((t) => t.type === 'income' && t.date.startsWith(currentMonthStr))
    .reduce((acc, t) => acc + t.amount, 0);

  const calculated10PercentTithe = Math.round(currentMonthIncomes * 0.1);

  const totalTithesGiven = (state.stewardship || [])
    .filter((r) => r.type === 'tithe' || r.type === 'Diezmo')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalOfferingsGiven = (state.stewardship || [])
    .filter((r) => r.type !== 'tithe' && r.type !== 'Diezmo')
    .reduce((acc, r) => acc + r.amount, 0);

  const getTypeLabel = (t: StewardshipRecord['type']) => {
    switch (t) {
      case 'tithe':
      case 'Diezmo':
        return 'Diezmo';
      case 'offering':
      case 'Ofrenda':
        return 'Ofrenda';
      case 'firstfruit':
        return 'Primicia';
      case 'Ayuda':
        return 'Ayuda';
      case 'Misiones':
        return 'Misiones';
      case 'Donación':
      case 'charity':
      default:
        return 'Obras Sociales';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    const newRecord: StewardshipRecord = {
      id: `stew-${Date.now()}`,
      date,
      type,
      amount: parsed,
      recipient,
      notes,
    };

    onAddStewardshipRecord(newRecord);
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>Paso 10 • Principios Bíblicos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Mayordomía Cristiana
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administración bíblica del dinero: diezmos, ofrendas, primicias y generosidad con los necesitados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Aporte / Diezmo
        </button>
      </div>

      {/* Tithe Calculator Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 max-w-xl min-w-0">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> Calculadora Automática de Diezmo (10%)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tabular-nums">
            Diezmo Sugerido Este Mes: {formatCurrency(calculated10PercentTithe)}
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Basado en tus ingresos registrados en el mes ({formatCurrency(currentMonthIncomes)}).
            "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos" - Proverbios 3:9.
          </p>
        </div>

        <button
          onClick={() => {
            setAmount(calculated10PercentTithe > 0 ? String(calculated10PercentTithe) : '');
            setType('tithe');
            setShowAddModal(true);
          }}
          className="w-full md:w-auto px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl text-xs whitespace-nowrap shadow-lg tabular-nums shrink-0"
        >
          Diezmar {formatCurrency(calculated10PercentTithe)}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Total Diezmos Entregados</p>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalTithesGiven)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Ofrendas & Generosidad</p>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalOfferingsGiven)}
          </p>
        </div>
      </div>

      {/* Records List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-sm">
          Historial de Diezmos y Ofrendas
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {(state.stewardship || []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay aportes registrados aún.
            </div>
          ) : (
            (state.stewardship || []).map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      {getTypeLabel(r.type)}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(r.date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {r.recipient || '-'}
                  </p>
                  {r.notes && <p className="text-xs text-slate-400 truncate">{r.notes}</p>}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatCurrency(r.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteStewardshipRecord(r.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl"
                    title="Eliminar registro"
                    aria-label="Eliminar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Fecha</th>
                <th className="p-3 sm:p-4">Tipo</th>
                <th className="p-3 sm:p-4">Destino / Iglesia</th>
                <th className="p-3 sm:p-4">Monto (RD$)</th>
                <th className="p-3 sm:p-4">Notas</th>
                <th className="p-3 sm:p-4 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(state.stewardship || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay aportes registrados aún.
                  </td>
                </tr>
              ) : (
                (state.stewardship || []).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 sm:p-4 text-slate-500">{formatDate(r.date)}</td>
                    <td className="p-3 sm:p-4">
                      <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs px-2.5 py-0.5 rounded uppercase">
                        {getTypeLabel(r.type)}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">
                      {r.recipient || '-'}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-400 text-xs">{r.notes || '-'}</td>
                    <td className="p-3 sm:p-4 text-right">
                      <button
                        onClick={() => onDeleteStewardshipRecord(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Aporte de Mayordomía
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Aporte
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as 'tithe' | 'offering' | 'firstfruit' | 'charity')
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                >
                  <option value="tithe">Diezmo (10%)</option>
                  <option value="offering">Ofrenda Voluntaria</option>
                  <option value="firstfruit">Primicias</option>
                  <option value="charity">Donación / Obra Social / Necesitados</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Iglesia / Destinatario
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="ej. Iglesia Central, Fundación..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Guardar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
