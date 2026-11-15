import React, { useState } from 'react';
import { Archive, Plus, AlertCircle, Trash2, Search, Refrigerator } from 'lucide-react';
import { AppState, HomeInventoryItem } from '../types';
import { formatDate } from '../utils/formatters';

interface HomeInventoryViewProps {
  state: AppState;
  onAddInventoryItem: (item: HomeInventoryItem) => void;
  onDeleteInventoryItem: (id: string) => void;
}

export const HomeInventoryView: React.FC<HomeInventoryViewProps> = ({
  state,
  onAddInventoryItem,
  onDeleteInventoryItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState<'Despensa' | 'Nevera' | 'Freezer'>('Despensa');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('unidad');
  const [expirationDate, setExpirationDate] = useState('');

  const filteredItems = state.inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesLoc = selectedLocation === 'ALL' || item.location === selectedLocation;
    return matchesSearch && matchesLoc;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseFloat(quantity) || 1;
    if (!productName) return;

    const newItem: HomeInventoryItem = {
      id: `inv-${Date.now()}`,
      name: productName,
      category: 'Alimentos',
      location: location as any,
      quantity: q,
      unit,
      purchaseDate: new Date().toISOString().slice(0, 10),
      expirationDate: expirationDate || new Date().toISOString().slice(0, 10),
      estimatedDailyConsumption: 1,
    };

    onAddInventoryItem(newItem);
    setProductName('');
    setExpirationDate('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <Archive className="w-4 h-4 shrink-0" />
            <span>Módulo de Despensa & Inventario</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Inventario del Hogar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de víveres en despensa, nevera y freezer para evitar desperdicio y vencer caducidades.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Insumo
        </button>
      </div>

      {/* Location Filter & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en despensa o congelador..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />
        </div>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none font-semibold"
        >
          <option value="ALL">Todas las Ubicaciones</option>
          <option value="Despensa">📦 Despensa</option>
          <option value="Nevera">🥦 Nevera</option>
          <option value="Freezer">❄️ Freezer</option>
        </select>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Tu inventario del hogar está vacío.
          </p>
          <p className="text-xs text-slate-400">
            Registra víveres de despensa, nevera o freezer para controlar cantidades y fechas de vencimiento.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            + Registrar Primer Insumo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {item.location === 'Despensa'
                      ? '📦 Despensa'
                      : item.location === 'Nevera'
                      ? '🥦 Nevera'
                      : '❄️ Freezer'}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2 truncate">
                    {item.name}
                  </h3>
                </div>

                <button
                  onClick={() => onDeleteInventoryItem(item.id)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                  title="Eliminar insumo"
                  aria-label="Eliminar insumo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm tabular-nums">
                  Stock: {item.quantity} {item.unit}
                </span>

                {item.expirationDate && (
                  <span className="text-[11px] text-amber-600 font-semibold tabular-nums">
                    Vence: {formatDate(item.expirationDate)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92dvh] overflow-y-auto pb-safe">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Insumo en Inventario
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Insumo / Alimento *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="ej. Arroz, Habichuelas, Leche, Pollo congelado..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ubicación
                  </label>
                  <select
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value as 'Despensa' | 'Nevera' | 'Freezer')
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    <option value="Despensa">Despensa</option>
                    <option value="Nevera">Nevera</option>
                    <option value="Freezer">Freezer</option>
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unidad
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    <option value="lb">Libra (lb)</option>
                    <option value="funda">Funda</option>
                    <option value="unidad">Unidad</option>
                    <option value="lata">Lata</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Caducidad
                  </label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
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
