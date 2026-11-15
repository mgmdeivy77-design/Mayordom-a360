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
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  state,
  onAddShoppingItem,
  onToggleShoppingItem,
  onDeleteShoppingItem,
  onClearCheckedShoppingItems,
}) => {
  const [selectedStore, setSelectedStore] = useState<SupermarketName>('Bravo');
  const [budgetCap, setBudgetCap] = useState('15000');
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
    const price = parseFloat(estimatedUnitPrice) || 100;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Módulo de Compras Inteligentes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Lista Inteligente de Compras RD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planifica tus compras en supermercados dominicanos, controla el presupuesto del carrito.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onClearCheckedShoppingItems}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            Limpiar Comprados
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Estimado Total Carrito</p>
          <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
            {formatCurrency(totalEstimatedCost)}
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Ya Comprado (Efectivo)</p>
          <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-0.5">
            {formatCurrency(checkedCost)}
          </p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Límite Tope Compras</p>
            <input
              type="number"
              value={budgetCap}
              onChange={(e) => setBudgetCap(e.target.value)}
              className="w-28 text-xl font-extrabold bg-transparent text-amber-900 dark:text-amber-100 outline-none"
            />
          </div>
          {isOverBudget && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-1 rounded">
              !Límite Excedido!
            </span>
          )}
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
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
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  item.checked
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleShoppingItem(item.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-transparent'
                    }`}
                  >
                    {item.checked && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4
                      className={`font-bold text-sm text-slate-900 dark:text-white ${
                        item.checked ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Cant: {item.quantity} {item.unit} • Est.: {formatCurrency(item.estimatedUnitPrice)}/u
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(item.quantity * item.estimatedUnitPrice)}
                  </span>
                  <button
                    onClick={() => onDeleteShoppingItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
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

              <div className="grid grid-cols-2 gap-3">
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
