import React, { useState } from 'react';
import { X, Plus, Wallet, Receipt } from 'lucide-react';
import { AppState, Transaction, TransactionType } from '../types';

interface QuickAddTransactionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
  state: AppState;
}

export const QuickAddTransactionModal: React.FC<QuickAddTransactionModalProps> = ({
  isOpen = true,
  onClose,
  onAddTransaction,
  state,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Banco Popular');
  const [store, setStore] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  if (!isOpen) return null;

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

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date,
      type,
      description,
      category: category || categories[0],
      amount: parsedAmount,
      account,
      store: type === 'expense' ? store : undefined,
      notes,
    };

    onAddTransaction(newTx);
    // reset
    setDescription('');
    setAmount('');
    setNotes('');
    setStore('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Registrar Movimiento Financiero
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Selector Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory(expenseCategories[0]);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Gasto / Salida (DOP$)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory(incomeCategories[0]);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Ingreso / Entrada (DOP$)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción del movimiento *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ej. Compra quincenal Bravo, Nómina, Combustible..."
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="0.00"
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría
              </label>
              <select
                value={category || categories[0]}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                Cuenta / Banco / Vía
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Banco Popular">Banco Popular</option>
                <option value="Banreservas">Banreservas</option>
                <option value="Banco BHD">Banco BHD</option>
                <option value="APAP">APAP (Asociación Popular)</option>
                <option value="Scotiabank">Scotiabank</option>
                <option value="Tarjeta Popular">Tarjeta Popular</option>
                <option value="Tarjeta BHD">Tarjeta BHD</option>
                <option value="Efectivo">Efectivo en mano</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supermercado / Establecimiento (opcional)
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Ninguno / General --</option>
                {state.settings.favoriteSupermarkets.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles sobre el pago..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform active:scale-95 ${
                type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
