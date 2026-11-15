import React, { useState } from 'react';
import { ShoppingBag, Plus, Check, Trash2, Scale, DollarSign } from 'lucide-react';
import { AppState, ShoppingListItem, SupermarketName } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ShoppingListViewProps {
  state: AppState;
  onAddShoppingItem: (item: ShoppingListItem) => void;
  onToggleShoppingItem: (id: string) => void;
  onDeleteShoppingItem: (id: string) => void;
  onClearCheckedShoppingItems: () => void;
  onClearAllShoppingItems?: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  state,
  onAddShoppingItem,
  onToggleShoppingItem,
  onDeleteShoppingItem,
  onClearCheckedShoppingItems,
  onClearAllShoppingItems,
}) => {
  const [selectedStore, setSelectedStore] = useState<SupermarketName>('Bravo');
  const [budgetCap, setBudgetCap] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentos');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('unidad');
  const [estimatedUnitPrice, setEstimatedUnitPrice] = useState('');

  const stores: SupermarketName[] = [
    'Bravo',
    'Nacional',
    'Jumbo',
    'La Sirena',
    'Olé',
    'PriceSmart',
    'SuperFresh',
    'Iberia',
    'Aprezio',
    'Mercado/Colmado',
    'Otro',
  ];

  const filteredItems = state.shoppingList.filter((item) => item.store === selectedStore || !item.store);

  const totalEstimatedCost = filteredItems.reduce(
    (acc, item) => acc + item.quantity * item.estimatedUnitPrice,
    0
  );
  const checkedCost = filteredItems
    .filter((item) => item.checked)
    .reduce((acc, item) => acc + item.quantity * item.estimatedUnitPrice, 0);

  const parsedCap = parseFloat(budgetCap) || 0;
  const isOverBudget = parsedCap > 0 && totalEstimatedCost > parsedCap;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseFloat(quantity) || 1;
    const price = parseFloat(estimatedUnitPrice) || 0;
    if (!name) return;

    const newItem: ShoppingListItem = {
      id: `shop-${Date.now()}`,
      name,
      category,
      store: selectedStore,
      quantity: q,
      unit,
      estimatedUnitPrice: price,
      checked: false,
    };

    onAddShoppingItem(newItem);
    setName('');
    setEstimatedUnitPrice('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Módulo de Compras Inteligentes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Lista Inteligente de Compras RD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planifica tus compras en supermercados dominicanos, controla el presupuesto del carrito.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onClearCheckedShoppingItems}
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Limpiar Comprados
          </button>
          {onClearAllShoppingItems && state.shoppingList.length > 0 && (
            <button
              onClick={onClearAllShoppingItems}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Vaciar Lista
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 sm:px-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Agregar Artículo
          </button>
        </div>
      </div>

      {/* Supermarket Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Selecciona tu Supermercado Destino
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {stores.map((s) => {
            const isSelected = selectedStore === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedStore(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Limit vs Estimated Total Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Estimado Total Carrito</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(totalEstimatedCost)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Ya Comprado (Efectivo)</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-0.5 tabular-nums truncate">
            {formatCurrency(checkedCost)}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Límite Tope Compras (RD$)</p>
            <input
              type="number"
              min="0"
              value={budgetCap}
              onChange={(e) => setBudgetCap(e.target.value)}
              placeholder="Sin tope"
              className="w-full max-w-[140px] text-lg sm:text-xl font-extrabold bg-transparent text-amber-900 dark:text-amber-100 outline-none placeholder:text-amber-700/40 tabular-nums"
            />
          </div>
          {isOverBudget && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-1 rounded shrink-0">
              ¡Límite Excedido!
            </span>
          )}
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          Artículos en la Lista ({selectedStore})
        </h3>

        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No hay artículos en la lista para {selectedStore}. Presiona "Agregar Artículo" para comenzar.
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
                  item.checked
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleShoppingItem(item.id)}
                    className={`w-7 h-7 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-transparent'
                    }`}
                    aria-label={item.checked ? 'Desmarcar artículo' : 'Marcar como comprado'}
                  >
                    {item.checked && <Check className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={`font-bold text-sm text-slate-900 dark:text-white truncate ${
                        item.checked ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 truncate tabular-nums">
                      Cant: {item.quantity} {item.unit} • Est.: {formatCurrency(item.estimatedUnitPrice)}/u
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tabular-nums">
                    {formatCurrency(item.quantity * item.estimatedUnitPrice)}
                  </span>
                  <button
                    onClick={() => onDeleteShoppingItem(item.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Eliminar artículo"
                    aria-label="Eliminar artículo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Agregar Artículo a la Lista
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Arroz Campos 10lb, Aceite Crisol..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unidad
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    <option value="funda">Funda</option>
                    <option value="lb">Libra (lb)</option>
                    <option value="unidad">Unidad</option>
                    <option value="caja">Caja / Cartón</option>
                    <option value="litro">Litro</option>
                    <option value="galón">Galón</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Precio Unitario Estimado (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={estimatedUnitPrice}
                  onChange={(e) => setEstimatedUnitPrice(e.target.value)}
                  placeholder="ej. 395"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
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
                  Agregar a la Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
