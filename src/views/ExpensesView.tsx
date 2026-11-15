import React, { useState } from 'react';
import { Plus, Receipt, Trash2, Search, Filter, ShoppingBag } from 'lucide-react';
import { AppState, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExpensesViewProps {
  state: AppState;
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddCustomExpenseCategory: (cat: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  state,
  onAddTransaction,
  onDeleteTransaction,
  onAddCustomExpenseCategory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Form
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Alimentos');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Banco Popular');
  const [store, setStore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const expenseCategories = [
    'Alimentos',
    'Combustible',
    'Electricidad',
    'Agua',
    'Internet',
    'Celular',
    'Colegio',
    'Universidad',
    'Salud',
    'Medicamentos',
    'Diezmos',
    'Ofrendas',
    'Transporte',
    'Préstamos',
    'Tarjetas',
    'Ropa',
    'Recreación',
    'Impuestos',
    'Mascotas',
    'Emergencias',
    'Otros',
    ...state.settings.customExpenseCategories,
  ];

  const expenses = state.transactions.filter((t) => t.type === 'expense');

  const filteredExpenses = expenses.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase()) ||
      (t.store && t.store.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalExpenses = filteredExpenses.reduce((acc, t) => acc + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `exp-${Date.now()}`,
      date,
      type: 'expense',
      description,
      category,
      amount: parsedAmount,
      account,
      store: store || undefined,
      notes,
    };

    onAddTransaction(newTx);
    setDescription('');
    setAmount('');
    setNotes('');
    setStore('');
    setShowAddModal(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCustomExpenseCategory(newCatName.trim());
      setCategory(newCatName.trim());
      setNewCatName('');
      setShowCategoryModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Módulo de Gastos</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Gestión de Salidas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Categoriza tus salidas, pagos de servicios, colegio, combustible y compras familiares.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Categoría
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Registrar Gasto
          </button>
        </div>
      </div>

      {/* Filter and Total bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              Total Gastos Filtrados
            </p>
            <p className="text-2xl font-extrabold text-rose-900 dark:text-rose-100 mt-0.5">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-3 bg-rose-600 text-white rounded-xl">
            <Receipt className="w-6 h-6" />
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
              placeholder="Buscar por descripción, tienda o banco..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          >
            <option value="ALL">Todas las categorías</option>
            {expenseCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 sm:p-4">Fecha</th>
                <th className="p-3 sm:p-4">Descripción</th>
                <th className="p-3 sm:p-4">Categoría</th>
                <th className="p-3 sm:p-4">Establecimiento</th>
                <th className="p-3 sm:p-4">Vía / Banco</th>
                <th className="p-3 sm:p-4">Monto (DOP$)</th>
                <th className="p-3 sm:p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No hay gastos registrados con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((t) => (
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
                      <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-300">
                      {t.store ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">
                          <ShoppingBag className="w-3 h-3 text-emerald-600" />
                          {t.store}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-300">
                      {t.account}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-slate-900 dark:text-white">
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

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              Nueva Categoría de Gasto
            </h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="ej. Gimnasio, Mantenimiento Casa..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Nuevo Gasto
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
                  placeholder="ej. Compra Bravo, Combustible Sunix, Luz..."
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
                    {expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vía / Banco
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
                    <option value="Tarjeta Popular">Tarjeta Popular</option>
                    <option value="Tarjeta BHD">Tarjeta BHD</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Establecimiento / Supermercado (opcional)
                </label>
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  <option value="">-- Ninguno --</option>
                  {state.settings.favoriteSupermarkets.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
