import React, { useState } from 'react';
import { TrendingUp, Plus, Building, DollarSign, Trash2, ShieldCheck } from 'lucide-react';
import { AppState, Investment, InvestmentType } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface InvestmentsViewProps {
  state: AppState;
  onAddInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  state,
  onAddInvestment,
  onDeleteInvestment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('Banreservas AFI');
  const [type, setType] = useState<InvestmentType>('CD');
  const [capital, setCapital] = useState('');
  const [returnRateAnnual, setReturnRateAnnual] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [maturityDate, setMaturityDate] = useState('');
  const [notes, setNotes] = useState('');

  const types: InvestmentType[] = [
    'CD',
    'Bonos',
    'Fondos',
    'Acciones',
    'ETF',
    'Negocios',
    'Bienes raíces',
    'Criptomonedas',
    'Otros',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(capital);
    const rate = parseFloat(returnRateAnnual) || 0;
    if (!name || isNaN(cap) || cap <= 0) return;

    const profit = Math.round(cap * (rate / 100));
    const currentValue = cap + profit;

    const newInv: Investment = {
      id: `inv-${Date.now()}`,
      type,
      name,
      institution,
      capital: cap,
      returnRateAnnual: rate,
      currentValue,
      profit,
      startDate,
      maturityDate: maturityDate || undefined,
      notes,
    };

    onAddInvestment(newInv);
    setName('');
    setCapital('');
    setReturnRateAnnual('');
    setShowAddModal(false);
  };

  const totalCapital = state.investments.reduce((acc, i) => acc + i.capital, 0);
  const totalValue = state.investments.reduce((acc, i) => acc + i.currentValue, 0);
  const totalProfit = state.investments.reduce((acc, i) => acc + i.profit, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Módulo de Inversiones</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Portafolio de Inversión Familiar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certificados financieros en RD$, Bonos de Hacienda, Puestos de Bolsa y Fondos Abiertos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Registrar Inversión
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Capital Invertido</p>
          <p className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-0.5">
            {formatCurrency(totalCapital)}
          </p>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Valor Valorizado Actual</p>
          <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
            {formatCurrency(totalValue)}
          </p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Ganancia Acumulada</p>
          <p className="text-2xl font-extrabold text-amber-900 dark:text-amber-100 mt-0.5">
            +{formatCurrency(totalProfit)}
          </p>
        </div>
      </div>

      {/* Investments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.investments.map((inv) => (
          <div
            key={inv.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {inv.type} • {inv.institution}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                  {inv.name}
                </h3>
              </div>

              <button
                onClick={() => onDeleteInvestment(inv.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
              <div>
                <span className="text-slate-500">Capital Inicial:</span>
                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(inv.capital)}</p>
              </div>
              <div>
                <span className="text-slate-500">Tasa Anual:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{inv.returnRateAnnual}% anual</p>
              </div>
              <div>
                <span className="text-slate-500">Valor Actual:</span>
                <p className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(inv.currentValue)}</p>
              </div>
              <div>
                <span className="text-slate-500">Rendimiento:</span>
                <p className="font-bold text-amber-600 dark:text-amber-400">+{formatCurrency(inv.profit)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Inicio: {formatDate(inv.startDate)}</span>
              {inv.maturityDate && <span>Vencimiento: {formatDate(inv.maturityDate)}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Registrar Nueva Inversión
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Inversión *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Certificado Banreservas, Bonos Hacienda..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institución / Puesto de Bolsa
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="ej. JMMB, CCI, Banreservas"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Activo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InvestmentType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Capital Inicial (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tasa Anual (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={returnRateAnnual}
                    onChange={(e) => setReturnRateAnnual(e.target.value)}
                    placeholder="ej. 11.5"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vencimiento (opcional)
                  </label>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
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
