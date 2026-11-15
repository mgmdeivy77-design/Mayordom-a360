import React, { useState } from 'react';
import { Package, Search, Plus, Trash2 } from 'lucide-react';
import { AppState, Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProductCatalogViewProps {
  state: AppState;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  state,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Carnes');
  const [defaultUnit, setDefaultUnit] = useState('lb');
  const [bravoPrice, setBravoPrice] = useState('');
  const [nacionalPrice, setNacionalPrice] = useState('');
  const [brand, setBrand] = useState('');

  const categories = [
    'Carnes',
    'Pollo',
    'Pescados',
    'Vegetales',
    'Frutas',
    'Lácteos',
    'Pan',
    'Arroz',
    'Habichuelas',
    'Aceites',
    'Condimentos',
    'Limpieza',
    'Higiene',
    'Bebidas',
    'Congelados',
    'Snacks',
    'Mascotas',
    'Bebés',
    'Electrodomésticos',
    'Ferretería',
    'Farmacia',
  ];

  const filteredProducts = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const prices: Record<string, number> = {};
    if (bravoPrice) prices['Bravo'] = parseFloat(bravoPrice);
    if (nacionalPrice) prices['Nacional'] = parseFloat(nacionalPrice);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      category,
      defaultUnit,
      pricesByStore: prices,
      brand,
    };

    onAddProduct(newProd);
    setName('');
    setBravoPrice('');
    setNacionalPrice('');
    setBrand('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 shrink-0" />
            <span>Módulo de Catálogo de Productos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Base de Productos & Víveres RD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Artículos de tu canasta básica organizados por categoría y precio por supermercado.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Producto
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto (ej. Arroz, Pollo, Leche, Jabón...)"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
        >
          <option value="ALL">Todas las Categorías ({categories.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No hay productos registrados en tu catálogo.
          </p>
          <p className="text-xs text-slate-400">
            Agrega tus productos frecuentes para comparar precios entre supermercados.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            + Registrar Primer Producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase truncate">
                    {prod.category}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {prod.brand && (
                      <span className="text-xs text-slate-400 font-semibold truncate max-w-[100px]">{prod.brand}</span>
                    )}
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Eliminar producto"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1.5 truncate">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-500">Unidad estándar: {prod.defaultUnit}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Precios por Supermercado:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(prod.pricesByStore).length === 0 ? (
                    <span className="text-[11px] text-slate-400">Sin precios registrados</span>
                  ) : (
                    Object.entries(prod.pricesByStore).map(([store, price]) => (
                      <span
                        key={store}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-[11px] font-medium tabular-nums"
                      >
                        <strong>{store}:</strong> {formatCurrency(price as number)}
                      </span>
                    ))
                  )}
                </div>
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
              Registrar Nuevo Producto
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
                  placeholder="ej. Arroz Selecto Campos 10lb"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
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
                    Marca (opcional)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="ej. Crisol, Induveca"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Precio Bravo (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bravoPrice}
                    onChange={(e) => setBravoPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Precio Nacional (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nacionalPrice}
                    onChange={(e) => setNacionalPrice(e.target.value)}
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
