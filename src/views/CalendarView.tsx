import React, { useState } from 'react';
import { CalendarDays, Plus, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { AppState, CalendarEvent, EventCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CalendarViewProps {
  state: AppState;
  onAddCalendarEvent: (evt: CalendarEvent) => void;
  onToggleEventPaid: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  state,
  onAddCalendarEvent,
  onToggleEventPaid,
  onDeleteEvent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<EventCategory>('payment');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const categories: { label: string; value: EventCategory; color: string }[] = [
    { label: 'Pago de Servicio', value: 'payment', color: 'bg-rose-100 text-rose-700' },
    { label: 'Vencimiento Deuda', value: 'due', color: 'bg-amber-100 text-amber-700' },
    { label: 'Cobro / Ingreso', value: 'income', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Recordatorio General', value: 'reminder', color: 'bg-blue-100 text-blue-700' },
    { label: 'Cumpleaños / Celebración', value: 'birthday', color: 'bg-purple-100 text-purple-700' },
    { label: 'Seguros', value: 'insurance', color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Impuestos (DGII/IPI)', value: 'tax', color: 'bg-red-100 text-red-700' },
    { label: 'Renovaciones / Marbete', value: 'renewal', color: 'bg-teal-100 text-teal-700' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvt: CalendarEvent = {
      id: `cal-${Date.now()}`,
      date,
      title,
      category,
      amount: amount ? parseFloat(amount) : undefined,
      isPaid: false,
      notes,
    };

    onAddCalendarEvent(newEvt);
    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  const sortedEvents = [...state.calendarEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Módulo de Agenda Financiera</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Calendario Financiero
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programe cobros, vencimientos de préstamos, marbetes, impuestos y renovación de seguros.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Agendar Evento
        </button>
      </div>

      {/* Events List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedEvents.map((evt) => {
          const catInfo = categories.find((c) => c.value === evt.category) || categories[0];
          return (
            <div
              key={evt.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                evt.isPaid
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${catInfo.color}`}>
                    {catInfo.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(evt.date)}
                  </span>
                </div>

                <h3
                  className={`font-bold text-sm text-slate-900 dark:text-white ${
                    evt.isPaid ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {evt.title}
                </h3>

                {evt.amount && (
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(evt.amount)}
                  </p>
                )}

                {evt.notes && <p className="text-xs text-slate-500">{evt.notes}</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleEventPaid(evt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    evt.isPaid
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {evt.isPaid ? 'Pagado' : 'Marcar Pagado'}
                </button>

                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Agendar Evento Financiero
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título del evento *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Pago Luz Edeeste, Marbete Vehículo, Seguro..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Aprox (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas adicionales
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
