import React, { useState } from 'react';
import { Plus, Wallet, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { AppState, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface IncomesViewProps {
  state: AppState;
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const IncomesView: React.FC<IncomesViewProps> = ({
  state,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Salario');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Banco Popular');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const incomeCategories = [
    'Salario',
    'Negocio',
    'Freelance',
    'Comisiones',
    'Bonificaciones',
    'Alquileres',
    'Remesas',
    'Regalos',
    'Ingresos extraordinarios',
    ...state.settings.customIncomeCategories,
  ];

  const incomes = state.transactions.filter((t) => t.type === 'income');

  const filteredIncomes = incomes.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalIncomes = filteredIncomes.reduce((acc, t) => acc + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `inc-${Date.now()}`,
      date,
      type: 'income',
      description,
      category,
      amount: parsedAmount,
      account,
      notes,
    };

    onAddTransaction(newTx);
    setDescription('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>Módulo de Ingresos</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Gestión de Entradas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registra salarios, remesas, proyectos freelance, bonificaciones y alquileres.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Registrar Ingreso
        </button>
      </div>

      {/* Filter and Total bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Total Ingresos Filtrados
            </p>
            <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
              {formatCurrency(totalIncomes)}
            </p>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Search */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descripción o banco..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          >
            <option value="ALL">Todas las categorías</option>
            {incomeCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 sm:p-4">Fecha</th>
                <th className="p-3 sm:p-4">Descripción</th>
                <th className="p-3 sm:p-4">Categoría</th>
                <th className="p-3 sm:p-4">Cuenta / Vía</th>
                <th className="p-3 sm:p-4">Monto (DOP$)</th>
                <th className="p-3 sm:p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay ingresos registrados con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 sm:p-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">
                      {t.description}
                      {t.notes && (
                        <p className="text-[11px] text-slate-400 font-normal">{t.notes}</p>
                      )}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-300">
                      {t.account}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="p-3 sm:p-4 text-right">
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                        title="Eliminar"
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

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Nuevo Ingreso
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ej. Salario nómina, Proyecto cliente..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    {incomeCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cuenta / Banco
                  </label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="Banco Popular">Banco Popular</option>
                    <option value="Banreservas">Banreservas</option>
                    <option value="Banco BHD">Banco BHD</option>
                    <option value="APAP">APAP</option>
                    <option value="Scotiabank">Scotiabank</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
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
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
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
