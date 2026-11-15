import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  PiggyBank,
  WifiOff,
} from 'lucide-react';
import { AppState } from '../types';
import { calculateFinancialTotals, formatCurrency } from '../utils/formatters';

interface AIRecommendation {
  type: 'warning' | 'savings' | 'investment' | 'tip' | string;
  title: string;
  description: string;
}

interface AIAnalysisResult {
  summary: string;
  healthScore?: number;
  recommendations: AIRecommendation[];
  supermarketTip?: string;
  isLocalFallback?: boolean;
}

interface GeminiAIIntelligenceViewProps {
  state: AppState;
}

export const GeminiAIIntelligenceView: React.FC<GeminiAIIntelligenceViewProps> = ({ state }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResult | null>(null);

  const totals = calculateFinancialTotals(state);

  const shortcutQueries = [
    'Analizar mi presupuesto y darme un diagnóstico financiero completo.',
    '¿Cómo puedo salir de mis deudas más rápido usando el método bola de nieve?',
    'Sugerir un plan de ahorro para el supermercado en República Dominicana.',
    'Evaluar mi fondo de emergencia y darme recomendaciones de inversión segura.',
  ];

  const buildLocalAnalysis = (): AIAnalysisResult => {
    const net = totals.totalIncome - totals.totalExpense;
    const savingsRate =
      totals.totalIncome > 0 ? Math.round((net / totals.totalIncome) * 100) : 0;
    const healthScore = Math.max(
      25,
      Math.min(
        96,
        55 +
          (net > 0 ? 20 : -15) +
          (totals.budgetUsagePercentage <= 85 ? 12 : -8) +
          (totals.totalDebts < totals.totalIncome * 3 ? 8 : -5)
      )
    );

    return {
      summary:
        net >= 0
          ? `Tu balance neto actual muestra un excedente de ${formatCurrency(net)} (${savingsRate}% de margen). Tienes ${formatCurrency(totals.availableCash)} disponibles y deudas totales de ${formatCurrency(totals.totalDebts)}.`
          : `Tus gastos (${formatCurrency(totals.totalExpense)}) superan tus ingresos actuales (${formatCurrency(totals.totalIncome)}) por ${formatCurrency(Math.abs(net))}. Prioriza recortar gastos variables esta quincena.`,
      healthScore,
      recommendations: [
        {
          type: net < 0 ? 'warning' : 'savings',
          title: 'Control de Flujo Mensual',
          description:
            net >= 0
              ? `Destina al menos ${formatCurrency(Math.max(2000, Math.round(net * 0.4)))} de tu excedente hacia tu Fondo de Emergencia o metas prioritarias antes de gastar.`
              : 'Congela compras no esenciales durante 15 días y audita suscripciones o salidas de fin de semana.',
        },
        {
          type: 'tip',
          title: 'Estrategia de Deudas RD',
          description:
            totals.totalDebts > 0
              ? `Actualmente debes ${formatCurrency(totals.totalDebts)}. Aplica el método Bola de Nieve abonando RD$3,000–RD$5,000 extra a la deuda más pequeña o de mayor interés.`
              : '¡Excelente! Mantente libre de deudas de tarjetas de crédito pagando siempre el saldo total al corte.',
        },
        {
          type: 'investment',
          title: 'Crecimiento de Patrimonio',
          description:
            'Considera mover excedentes ociosos de cuenta corriente hacia un fondo mutuo abierto o certificado financiero en DOP$ para protegerte de la inflación.',
        },
      ],
      supermarketTip:
        'Planifica tu menú semanal los domingos, compara precios en el módulo Comparador RD y aprovecha miércoles/jueves de frutas y víveres en Bravo, Nacional, La Sirena o Jumbo.',
      isLocalFallback: true,
    };
  };

  const handleRunAnalysis = async (customQuery?: string) => {
    const activeQuery = (customQuery ?? query).trim();
    if (!activeQuery) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: {
            income: totals.totalIncome,
            expense: totals.totalExpense,
            net: totals.totalIncome - totals.totalExpense,
            debtsBalance: totals.totalDebts,
            availableCash: totals.availableCash,
            totalSavings: totals.totalSavings,
            totalInvestments: totals.totalInvestments,
            budgetUsagePercentage: totals.budgetUsagePercentage,
            savingsGoalsCount: state.savingsGoals.length,
          },
          query: activeQuery,
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.success || !payload?.data) {
        setResponse(buildLocalAnalysis());
      } else {
        setResponse({
          summary: payload.data.summary || 'Diagnóstico completado.',
          healthScore: payload.data.healthScore,
          recommendations: Array.isArray(payload.data.recommendations)
            ? payload.data.recommendations
            : [],
          supermarketTip: payload.data.supermarketTip,
          isLocalFallback: false,
        });
      }
    } catch {
      setResponse(buildLocalAnalysis());
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          box: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
        };
      case 'savings':
        return {
          box: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
          icon: <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
        };
      case 'investment':
        return {
          box: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50',
          icon: <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
        };
      default:
        return {
          box: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
          icon: <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4" />
          <span>Asistente Financiero Inteligente</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Asesor Financiero Mayordomo AI
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Análisis personalizado de tus finanzas adaptado a la economía de República Dominicana (funciona en línea con Gemini y con motor local sin conexión).
        </p>
      </div>

      {/* Shortcuts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Consultas Frecuentes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcutQueries.map((sc, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sc);
                handleRunAnalysis(sc);
              }}
              className="p-3.5 text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{sc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunAnalysis();
        }}
        className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe tu consulta financiera (ej. ¿Puedo comprar un carro de RD$800k?)"
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Consultar Asesor
            </>
          )}
        </button>
      </form>

      {/* Response Display */}
      {response && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Diagnóstico Financiero
                  </h3>
                  {response.isLocalFallback && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      <WifiOff className="w-3 h-3" />
                      Análisis Local Instantáneo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {response.summary}
                </p>
              </div>
            </div>

            {typeof response.healthScore === 'number' && (
              <div className="shrink-0 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Salud Financiera
                </span>
                <span
                  className={`text-2xl font-extrabold ${
                    response.healthScore >= 75
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : response.healthScore >= 50
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {response.healthScore}/100
                </span>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {response.recommendations && response.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                Recomendaciones Personalizadas
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {response.recommendations.map((rec, idx) => {
                  const style = getRecommendationStyle(rec.type);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex items-start gap-3 ${style.box}`}
                    >
                      {style.icon}
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {rec.title}
                        </h5>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dominican Supermarket Tip */}
          {response.supermarketTip && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs uppercase tracking-wider">
                  Tip de Supermercados RD
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  {response.supermarketTip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
