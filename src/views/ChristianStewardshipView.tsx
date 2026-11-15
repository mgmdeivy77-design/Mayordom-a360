import React, { useState } from 'react';
import { HeartHandshake, Calculator, Plus, CheckCircle, Heart, Sparkles } from 'lucide-react';
import { AppState, StewardshipRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ChristianStewardshipViewProps {
  state: AppState;
  onAddStewardshipRecord: (record: StewardshipRecord) => void;
}

export const ChristianStewardshipView: React.FC<ChristianStewardshipViewProps> = ({
  state,
  onAddStewardshipRecord,
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
    .filter((r) => r.type === 'tithe')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalOfferingsGiven = (state.stewardship || [])
    .filter((r) => r.type === 'offering' || r.type === 'firstfruit' || r.type === 'charity')
    .reduce((acc, r) => acc + r.amount, 0);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Módulo de Principios Bíblicos</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Mayordomía Cristiana
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administración bíblica del dinero: diezmos, ofrendas, primicias y generosidad con los necesitados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Registrar Aporte / Diezmo
        </button>
      </div>

      {/* Tithe Calculator Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Calculadora Automática de Diezmo (10%)
          </span>
          <h2 className="text-2xl font-extrabold">
            Diezmo Sugerido Este Mes: {formatCurrency(calculated10PercentTithe)}
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Basado en tus ingresos registrados en el mes ({formatCurrency(currentMonthIncomes)}).
            "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos" - Proverbios 3:9.
          </p>
        </div>

        <button
          onClick={() => {
            setAmount(String(calculated10PercentTithe));
            setType('tithe');
            setShowAddModal(true);
          }}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl text-xs whitespace-nowrap shadow-lg"
        >
          Diezmar {formatCurrency(calculated10PercentTithe)}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Total Diezmos Entregados</p>
          <p className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-0.5">
            {formatCurrency(totalTithesGiven)}
          </p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Ofrendas & Generosidad</p>
          <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-0.5">
            {formatCurrency(totalOfferingsGiven)}
          </p>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-sm">
          Historial de Diezmos y Ofrendas
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">Fecha</th>
                <th className="p-3 sm:p-4">Tipo</th>
                <th className="p-3 sm:p-4">Destino / Iglesia</th>
                <th className="p-3 sm:p-4">Monto (RD$)</th>
                <th className="p-3 sm:p-4">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(state.stewardship || []).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 sm:p-4 text-slate-500">{formatDate(r.date)}</td>
                  <td className="p-3 sm:p-4">
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs px-2.5 py-0.5 rounded uppercase">
                      {r.type === 'tithe'
                        ? 'Diezmo'
                        : r.type === 'offering'
                        ? 'Ofrenda'
                        : r.type === 'firstfruit'
                        ? 'Primicia'
                        : 'Obras Sociales'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">
                    {r.recipient}
                  </td>
                  <td className="p-3 sm:p-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="p-3 sm:p-4 text-slate-400 text-xs">{r.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
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

              <div className="grid grid-cols-2 gap-3">
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
