import React, { useState } from 'react';
import { Calculator, Percent, DollarSign, ShieldAlert, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const FinancialCalculatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'loan' | 'debtCapacity' | 'cd' | 'compound'>('loan');

  // Loan states
  const [loanAmount, setLoanAmount] = useState('500000');
  const [loanRate, setLoanRate] = useState('14');
  const [loanMonths, setLoanMonths] = useState('36');

  // Debt Capacity states
  const [monthlyIncome, setMonthlyIncome] = useState('125000');
  const [existingDebtPayments, setExistingDebtPayments] = useState('20000');

  // CD yield states
  const [cdCapital, setCdCapital] = useState('300000');
  const [cdRate, setCdRate] = useState('11.5');
  const [cdDays, setCdDays] = useState('365');

  // Compound savings states
  const [initialSavings, setInitialSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [compoundRate, setCompoundRate] = useState('10');
  const [years, setYears] = useState('5');

  // Loan calculation
  const parsedLoanAmt = parseFloat(loanAmount) || 0;
  const parsedLoanRate = parseFloat(loanRate) / 100 / 12 || 0;
  const parsedLoanM = parseInt(loanMonths) || 1;

  const loanPayment =
    parsedLoanRate > 0
      ? (parsedLoanAmt * parsedLoanRate * Math.pow(1 + parsedLoanRate, parsedLoanM)) /
        (Math.pow(1 + parsedLoanRate, parsedLoanM) - 1)
      : parsedLoanAmt / parsedLoanM;

  // Debt capacity calculation
  const parsedIncome = parseFloat(monthlyIncome) || 1;
  const parsedExistingPmt = parseFloat(existingDebtPayments) || 0;
  const maxDebtLimit35 = parsedIncome * 0.35;
  const availableDebtCapacity = Math.max(0, maxDebtLimit35 - parsedExistingPmt);
  const currentDebtRatio = Math.round((parsedExistingPmt / parsedIncome) * 100);

  // CD calculation
  const parsedCdCap = parseFloat(cdCapital) || 0;
  const parsedCdRate = parseFloat(cdRate) || 0;
  const parsedCdDays = parseInt(cdDays) || 365;
  const cdProfitGross = parsedCdCap * (parsedCdRate / 100) * (parsedCdDays / 365);
  const cdTaxDGII = cdProfitGross * 0.1; // 10% retención DGII intereses RD
  const cdProfitNet = cdProfitGross - cdTaxDGII;

  // Compound interest calculation
  const parsedInitS = parseFloat(initialSavings) || 0;
  const parsedContrib = parseFloat(monthlyContribution) || 0;
  const parsedCRate = parseFloat(compoundRate) / 100 / 12 || 0;
  const totalMonthsCompound = (parseInt(years) || 1) * 12;

  let compoundTotal = parsedInitS;
  for (let i = 0; i < totalMonthsCompound; i++) {
    compoundTotal = (compoundTotal + parsedContrib) * (1 + parsedCRate);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4 shrink-0" />
          <span>Módulo de Herramientas Financieras</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Calculadoras Financieras
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Simula préstamos, calcula capacidad de endeudamiento seguro (máx. 35%), certificados bancarios y proyección de ahorro.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'loan', label: 'Préstamos' },
          { id: 'debtCapacity', label: 'Capacidad Endeudamiento (35%)' },
          { id: 'cd', label: 'Certificados Financieros RD$' },
          { id: 'compound', label: 'Interés Compuesto' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {activeTab === 'loan' && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Calculadora de Cuota de Préstamo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Monto del Préstamo (RD$)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tasa Anual (%)</label>
                <input
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Plazo (Meses)</label>
                <input
                  type="number"
                  value={loanMonths}
                  onChange={(e) => setLoanMonths(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">Cuota Estimada Mensual:</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-1 tabular-nums">
                  {formatCurrency(Math.round(loanPayment))}
                </p>
              </div>
              <div className="text-left sm:text-right text-xs text-indigo-700 dark:text-indigo-300 tabular-nums">
                <p>Total a Pagar: <strong>{formatCurrency(Math.round(loanPayment * parsedLoanM))}</strong></p>
                <p>Total Intereses: <strong>{formatCurrency(Math.round(loanPayment * parsedLoanM - parsedLoanAmt))}</strong></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debtCapacity' && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Semáforo de Capacidad de Endeudamiento (Máximo 35% de Ingresos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Ingreso Familiar Neto Mensual (RD$)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Pagos de Deudas Actuales / Mes (RD$)</label>
                <input
                  type="number"
                  value={existingDebtPayments}
                  onChange={(e) => setExistingDebtPayments(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              currentDebtRatio <= 35
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase">Nivel de Endeudamiento Actual</span>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1 tabular-nums">{currentDebtRatio}% de tus ingresos</p>
                <p className="text-xs mt-1">
                  {currentDebtRatio <= 35
                    ? '🟢 Tu nivel de endeudamiento es saludable y está dentro del límite recomendado (30-35%).'
                    : '🔴 ¡Alerta! Excedes el límite recomendado de endeudamiento. Evita tomar nuevos créditos.'}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs font-semibold">Margen Disponible para Deudas:</span>
                <p className="text-xl sm:text-2xl font-extrabold mt-1 tabular-nums">{formatCurrency(availableDebtCapacity)}/mes</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cd' && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Rendimiento de Certificados Financieros RD$ (con deducción 10% DGII)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Capital a Invertir (RD$)</label>
                <input
                  type="number"
                  value={cdCapital}
                  onChange={(e) => setCdCapital(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tasa Anual (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cdRate}
                  onChange={(e) => setCdRate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Días de Permanencia</label>
                <input
                  type="number"
                  value={cdDays}
                  onChange={(e) => setCdDays(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Interés Neto a Recibir:</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1 tabular-nums">
                  +{formatCurrency(Math.round(cdProfitNet))}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-emerald-700 dark:text-emerald-300 tabular-nums">
                <p>Bruto: {formatCurrency(Math.round(cdProfitGross))}</p>
                <p>Retención DGII (10%): -{formatCurrency(Math.round(cdTaxDGII))}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compound' && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Proyección de Ahorro con Interés Compuesto
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Ahorro Inicial (RD$)</label>
                <input
                  type="number"
                  value={initialSavings}
                  onChange={(e) => setInitialSavings(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Aporte Mensual (RD$)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tasa Anual (%)</label>
                <input
                  type="number"
                  value={compoundRate}
                  onChange={(e) => setCompoundRate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Años</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                  Patrimonio Acumulado Estimado en {years} Años:
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 dark:text-amber-100 mt-1 tabular-nums">
                  {formatCurrency(Math.round(compoundTotal))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
