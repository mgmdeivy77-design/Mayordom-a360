import React, { useState } from 'react';
import { Scale, TrendingDown, Store, Search, CheckCircle2 } from 'lucide-react';
import { AppState, SupermarketName } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PriceComparatorViewProps {
  state: AppState;
}

export const PriceComparatorView: React.FC<PriceComparatorViewProps> = ({ state }) => {
  const [search, setSearch] = useState('');

  const stores: SupermarketName[] = [
    'Bravo',
    'Nacional',
    'Jumbo',
    'La Sirena',
    'Olé',
    'PriceSmart',
    'SuperFresh',
  ];

  const filteredProducts = state.products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>Módulo de Ahorro en Canasta Familiar</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Comparador Inteligente de Precios RD
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Encuentra qué supermercado vende más barato cada vívere o artículo de higiene (Supermercados Bravo, Nacional, Sirena, Olé, Jumbo, PriceSmart).
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto para comparar precios..."
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none"
        />
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 sm:p-4 min-w-[180px]">Producto / Marca</th>
                {stores.map((st) => (
                  <th key={st} className="p-3 sm:p-4 text-center">
                    {st}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                // Find lowest price
                const validPrices = Object.entries(p.pricesByStore).filter(([_, val]) => (val as number) > 0);
                const minPrice = validPrices.length > 0 ? Math.min(...validPrices.map(([_, v]) => v as number)) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 sm:p-4 font-bold text-slate-900 dark:text-white">
                      {p.name}
                      {p.brand && (
                        <span className="block text-[11px] font-normal text-slate-400">
                          {p.brand} ({p.defaultUnit})
                        </span>
                      )}
                    </td>

                    {stores.map((st) => {
                      const price = p.pricesByStore[st];
                      const isCheapest = price === minPrice && price > 0;

                      return (
                        <td key={st} className="p-3 sm:p-4 text-center">
                          {price ? (
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs ${
                                isCheapest
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/50'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {formatCurrency(price)}
                              {isCheapest && ' ⭐'}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
