import React, { useState } from 'react';
import { Plus, Wallet, Trash2, Search, Tag } from 'lucide-react';
import { AppState, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CategoryManagerModal } from '../components/CategoryManagerModal';

interface IncomesViewProps {
  state: AppState;
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddCategory: (kind: 'income' | 'expense', name: string) => void;
  onRenameCategory: (kind: 'income' | 'expense', oldName: string, newName: string) => void;
  onDeleteCategory: (kind: 'income' | 'expense', name: string) => void;
}

export const IncomesView: React.FC<IncomesViewProps> = ({
  state,
  onAddTransaction,
  onDeleteTransaction,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}) => {
  const incomeCategories =
    state.settings.incomeCategories && state.settings.incomeCategories.length > 0
      ? state.settings.incomeCategories
      : ['Salario', 'Negocio', 'Otros'];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(incomeCategories[0] || 'Salario');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Banco Popular');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const incomes = state.transactions.filter((t) => t.type === 'income');

  const filteredIncomes = incomes.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalIncomes = filteredIncomes.reduce((acc, t) => acc + t.amount, 0);

  const handleOpenAddModal = () => {
    if (!incomeCategories.includes(category)) {
      setCategory(incomeCategories[0] || '');
    }
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `inc-${Date.now()}`,
      date,
      type: 'income',
      description,
      category: category || incomeCategories[0] || 'Salario',
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 shrink-0" />
            <span>Paso 1 • Ingresos y Categorías de Entrada</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Gestión de Entradas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registra salarios, remesas, negocio o alquileres y personaliza tus categorías de entrada.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Editar / Añadir Categorías</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Registrar Ingreso</span>
          </button>
        </div>
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

      {/* Income List (Mobile Cards + Desktop Table) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredIncomes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No hay ingresos registrados. Presiona "Registrar Ingreso" para comenzar.
            </div>
          ) : (
            filteredIncomes.map((t) => (
              <div key={t.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {t.description}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {formatDate(t.date)} • {t.category} • {t.account}
                  </p>
                  {t.notes && (
                    <p className="text-[11px] text-slate-400 truncate">{t.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums">
                    {formatCurrency(t.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl"
                    title="Eliminar ingreso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 sm:p-4">Fecha</th>
                <th className="p-3 sm:p-4">Descripción</th>
                <th className="p-3 sm:p-4">Categoría</th>
                <th className="p-3 sm:p-4">Cuenta / Vía</th>
                <th className="p-3 sm:p-4">Monto (DOP$)</th>
                <th className="p-3 sm:p-4 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay ingresos registrados. Presiona "Registrar Ingreso" para comenzar.
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
                    <td className="p-3 sm:p-4 font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="p-3 sm:p-4 text-right">
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                        title="Eliminar ingreso"
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

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        initialTab="income"
        state={state}
        onAddCategory={onAddCategory}
        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}
      />

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto">
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
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
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
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Categoría
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowCategoryManager(true);
                      }}
                      className="text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      Editar
                    </button>
                  </div>
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
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
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
