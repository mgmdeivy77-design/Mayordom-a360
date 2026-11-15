import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Search,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Lock,
  PieChart,
  Calendar,
  CreditCard,
  Utensils,
  Boxes,
  FileSpreadsheet,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { exportUserGuidePdf } from '../utils/exportUtils';

interface UserGuideViewProps {
  onNavigate?: (view: string) => void;
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const guideSections = [
    {
      id: 'inicio-rapido',
      category: 'configuracion',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60',
      title: '1. Inicio Rápido y Seguridad de Datos',
      summary: 'Aprende cómo funciona el almacenamiento de datos locales y cómo proteger tus finanzas con PIN.',
      steps: [
        {
          title: 'Almacenamiento Local 100% Privado',
          desc: 'Toda tu información financiera se guarda exclusivamente en tu navegador vía LocalStorage. Ninguna otra entidad o servidor externo tiene acceso a tus balances.',
        },
        {
          title: 'Configuración del Perfil Familiar',
          desc: 'En el menú "Configuración y Respaldo", define el nombre de tu familia, cantidad de integrantes y provincia en República Dominicana para adaptar sugerencias de presupuesto.',
        },
        {
          title: 'Protección por Código PIN',
          desc: 'Activa la clave PIN de 4 dígitos en Configuración para bloquear la pantalla si compartes la computadora o dispositivo móvil con otros.',
        },
        {
          title: 'Copia de Seguridad y Restauración',
          desc: 'Genera archivos de respaldo en formato JSON regularmente para transferir o restaurar tus datos cuando cambies de navegador.',
        },
      ],
      targetView: 'settings',
    },
    {
      id: 'finanzas-presupuesto',
      category: 'finanzas',
      icon: Wallet,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60',
      title: '2. Gestión de Ingresos, Gastos y Presupuestos',
      summary: 'Registro diario de movimientos financieros y asignación de la regla 50/30/20.',
      steps: [
        {
          title: 'Registro de Ingresos y Remesas',
          desc: 'Ingresa tus sueldos fijos, ingresos por trabajo independiente, bonos o remesas recibidas en la moneda DOP$.',
        },
        {
          title: 'Registro Rápido de Gastos con Tiendas RD',
          desc: 'Utiliza el botón de entrada rápida "+" en la barra superior. Puedes asignar la tienda o supermercado (Sirena, Bravo, Jumbo, etc.) para auditorías detalladas.',
        },
        {
          title: 'Presupuesto Mensual y Regla 50/30/20',
          desc: 'Asigna techos máximos a categorías de Necesidades (50%), Deseos/Gusto (30%) y Ahorro/Inversión (20%). La barra de progreso se actualizará automáticamente.',
        },
        {
          title: 'Calendario de Facturas y Servicios',
          desc: 'Programe sus compromisos fijos como luz (CDEEE/Edeeste), agua (CAASD), internet, colegio o alquiler para recibir alertas previas al vencimiento.',
        },
      ],
      targetView: 'incomes',
    },
    {
      id: 'ahorro-deudas',
      category: 'finanzas',
      icon: PieChart,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60',
      title: '3. Ahorros, Fondo de Emergencia y Deudas',
      summary: 'Construcción de colchón financiero y estrategia de aceleración de pagos de deudas.',
      steps: [
        {
          title: 'Metas de Ahorro Programado',
          desc: 'Define objetivos con fecha estimada (ej: Enganche de vivienda, vacaciones, vehículo). El sistema calcula tu aporte mensual recomendado.',
        },
        {
          title: 'Fondo de Emergencia (3 a 12 meses)',
          desc: 'Monitorea el nivel de cobertura de tus gastos esenciales. El sistema te muestra si estás cubierto ante cualquier eventualidad.',
        },
        {
          title: 'Estrategia de Deudas (Bola de Nieve)',
          desc: 'Registra tarjetas de crédito y préstamos. Prioriza el pago al capital con mayor tasa de interés para liberarte de cuotas rápidamente.',
        },
        {
          title: 'Registro de Inversiones y Renta',
          desc: 'Lleva el control de Certificados Financieros en bancos dominicanos y Fondos Mutuos para calcular tus rendimientos reales.',
        },
      ],
      targetView: 'savings-goals',
    },
    {
      id: 'compras-hogar',
      category: 'compras',
      icon: ShoppingBag,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/60',
      title: '4. Compras Inteligentes y Menú Semanal RD',
      summary: 'Maximiza el presupuesto de alimentación, compara supermercados y gestiona tu despensa.',
      steps: [
        {
          title: 'Lista Inteligente de Compras',
          desc: 'Organiza los víveres por supermercado en RD y proyecta el gasto total antes de llegar a la caja registradora.',
        },
        {
          title: 'Comparador de Precios en Supermercados',
          desc: 'Ingresa un producto (ej: Arroz, Aceite, Leche) para ver qué establecimiento ofrece el precio más bajo en Santo Domingo o tu provincia.',
        },
        {
          title: 'Planificador de Menú Semanal',
          desc: 'Organiza los desayunos, almuerzos y cenas tradicionales. Usa el botón "Enviar ingredientes a la lista" para automatizar tu compra.',
        },
        {
          title: 'Inventario de Despensa y Nevera',
          desc: 'Lleva el conteo de existencias en el hogar y recibe alertas sobre productos próximos a vencer para evitar el desperdicio de alimentos.',
        },
      ],
      targetView: 'shopping-list',
    },
    {
      id: 'ai-reportes',
      category: 'herramientas',
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60',
      title: '5. Asistente IA, Reportes e Informes PDF',
      summary: 'Consultas en tiempo real con Gemini AI y exportaciones en PDF, Excel y CSV.',
      steps: [
        {
          title: 'Asistente Mayordomo AI (Gemini)',
          desc: 'Pregunta al asistente sobre cómo reducir gastos en la canasta familiar dominicana o cuál es el plan óptimo para consolidar deudas.',
        },
        {
          title: 'Reportes Financieros en PDF',
          desc: 'Descarga un estado contable listo para imprimir con gráficos de patrimonio, resumen de ahorro y listado de transacciones.',
        },
        {
          title: 'Hojas de Cálculo Excel (.xlsx)',
          desc: 'Exporta todas tus tablas para auditorías detalladas o análisis avanzados en Microsoft Excel o Google Sheets.',
        },
      ],
      targetView: 'reports',
    },
  ];

  const filteredSections = guideSections.filter((section) => {
    const matchesCategory = activeCategory === 'all' || section.category === activeCategory;
    const matchesSearch =
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
          <BookOpen className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md text-blue-200 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
            <BookOpen className="w-4 h-4" />
            <span>Manual del Usuario & Guía Oficial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Guía de Uso Mayordomo Familiar RD
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-90">
            Aprende a dominar cada herramienta de la aplicación para administrar el presupuesto
            de tu hogar, ahorrar en el supermercado, saldar deudas y hacer crecer tu patrimonio familiar.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={exportUserGuidePdf}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-transform active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Guía Completa en PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs backdrop-blur-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'Todos los Temas' },
            { id: 'configuracion', label: 'Seguridad & Config' },
            { id: 'finanzas', label: 'Finanzas & Presupuesto' },
            { id: 'compras', label: 'Compras & Hogar RD' },
            { id: 'herramientas', label: 'IA & Reportes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tema o función..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Guide Sections List */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              No se encontraron temas coincidentes
            </h3>
            <p className="text-xs text-slate-500">
              Prueba buscando otro término o cambiando el filtro de categoría.
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl shrink-0 ${section.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">
                        {section.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">{section.summary}</p>
                    </div>
                  </div>

                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(section.targetView)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shrink-0 transition-colors"
                    >
                      <span>Ir al Módulo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Preguntas Frecuentes</span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Preguntas Frecuentes y Mejores Prácticas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              ¿Qué pasa si borro el historial de mi navegador?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Si borras el caché o datos de sitio de LocalStorage, los datos se eliminarán. Por eso
              se recomienda descargar regularmente una Copia de Seguridad JSON desde Configuración.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              ¿Cómo funciona el Comparador de Precios?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Registra los precios observados en supermercados como La Sirena, Bravo, Jumbo o
              Nacional. El sistema resalta automáticamente la opción más económica para tu compra.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              ¿Puedo exportar mis reportes para enviar a mi pareja o contador?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¡Sí! En la sección "Reportes PDF / Excel" o en el botón superior de esta guía puedes
              descargar un archivo PDF consolidado con tablas legibles y listas para enviar.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              ¿Cómo ingresar a la app si olvido mi PIN de 4 dígitos?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El PIN por defecto o restablecimiento se gestiona limpiando el valor del PIN en la
              pantalla de inicio o restaurando un respaldo guardado previamente.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Call to Action Export */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-extrabold text-base">¿Deseas conservar este manual impreso o en PDF?</h3>
          <p className="text-xs text-slate-300">
            Descarga la versión oficial en PDF formateada para lectura rápida en cualquier dispositivo.
          </p>
        </div>

        <button
          onClick={exportUserGuidePdf}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-2xl text-xs shrink-0 transition-transform active:scale-95 shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Guía PDF</span>
        </button>
      </div>
    </div>
  );
};
