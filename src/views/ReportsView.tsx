import React from 'react';
import { FileText, Download, FileSpreadsheet, FileCode, BookOpen } from 'lucide-react';
import { AppState } from '../types';
import { exportPdfReport, exportExcelReport, exportCsvTransactions, exportUserGuidePdf } from '../utils/exportUtils';
import { formatCurrency } from '../utils/formatters';

interface ReportsViewProps {
  state: AppState;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ state }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Módulo de Exportación & Informes</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Reportes Financieros
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Genera estados consolidados en PDF, hojas de cálculo en Excel o archivos CSV compatibles.
        </p>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* User Guide PDF Export */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Guía de Uso & Manual PDF
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Descarga la guía oficial paso a paso con instrucciones para todos los módulos de la aplicación.
            </p>
          </div>

          <button
            onClick={() => exportUserGuidePdf()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl sm:rounded-2xl text-xs transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exportar Guía PDF
          </button>
        </div>
        {/* PDF Export */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Reporte PDF Profesional
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Descarga un estado impreso con resumen de ingresos, gastos, metas de ahorro y balance patrimonial.
            </p>
          </div>

          <button
            onClick={() => exportPdfReport(state)}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl sm:rounded-2xl text-xs transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Excel Export */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Planilla Excel (.xlsx)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exporta tablas dinámicas con todas tus transacciones, lista de compras y presupuestos.
            </p>
          </div>

          <button
            onClick={() => exportExcelReport(state)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl sm:rounded-2xl text-xs transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>

        {/* CSV Export */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <FileCode className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Datos Planos CSV
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Archivo liviano separado por comas para respaldos rápidos o análisis en Google Sheets.
            </p>
          </div>

          <button
            onClick={() => exportCsvTransactions(state)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl sm:rounded-2xl text-xs transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
};
