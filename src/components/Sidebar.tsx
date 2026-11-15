import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  CalendarDays,
  Target,
  Shield,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Package,
  Scale,
  Utensils,
  Boxes,
  Sparkles,
  Calculator,
  FileSpreadsheet,
  BarChart3,
  BookOpen,
  BookMarked,
  Building2,
  Settings,
  HeartHandshake,
  X,
} from 'lucide-react';
import { AppState } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  state?: AppState;
  enableChristianStewardship?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  mobileMenuOpen,
  onCloseMobileMenu,
  state,
  enableChristianStewardship,
}) => {
  const isStewardshipEnabled =
    enableChristianStewardship ?? state?.settings?.enableStewardshipModule ?? true;

  const navGroups = [
    {
      title: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
      ],
    },
    {
      title: 'PLAN FINANCIERO PASO A PASO',
      items: [
        { id: 'incomes', label: '1. Ingresos y Categorías', icon: Wallet },
        { id: 'expenses', label: '2. Gastos y Categorías', icon: Receipt },
        { id: 'monthly-budget', label: '3. Presupuesto Semanal / Mes', icon: PieChart },
        { id: 'annual-budget', label: '4. Presupuesto Anual', icon: BarChart3 },
        { id: 'calendar', label: '5. Calendario de Pagos', icon: CalendarDays },
        { id: 'emergency-fund', label: '6. Fondo de Emergencia', icon: Shield },
        { id: 'savings-goals', label: '7. Metas de Ahorro', icon: Target },
        { id: 'debts', label: '8. Control de Deudas', icon: CreditCard },
        { id: 'investments', label: '9. Inversiones & Renta', icon: TrendingUp },
        ...(isStewardshipEnabled
          ? [{ id: 'christian-stewardship', label: '10. Mayordomía Cristiana', icon: HeartHandshake }]
          : []),
      ],
    },
    {
      title: 'COMPRAS Y HOGAR RD',
      items: [
        { id: 'shopping-list', label: 'Lista Inteligente Compras', icon: ShoppingBag },
        { id: 'product-catalog', label: 'Base de Productos RD', icon: Package },
        { id: 'price-comparator', label: 'Comparador de Precios', icon: Scale },
        { id: 'weekly-menu', label: 'Planificador de Menú', icon: Utensils },
        { id: 'home-inventory', label: 'Inventario del Hogar', icon: Boxes },
      ],
    },
    {
      title: 'INTELIGENCIA Y HERRAMIENTAS',
      items: [
        { id: 'ai-intelligence', label: 'Asistente Mayordomo AI', icon: Sparkles, badge: 'IA' },
        { id: 'calculators', label: 'Calculadoras Financieras', icon: Calculator },
        { id: 'reports', label: 'Reportes PDF / Excel', icon: FileSpreadsheet },
        { id: 'user-guide', label: 'Guía de Uso & PDF', icon: BookMarked, badge: 'PDF' },
        { id: 'advanced-stats', label: 'Estadísticas y Tendencias', icon: BarChart3 },
        { id: 'education', label: 'Academia & Logros', icon: BookOpen },
      ],
    },
    {
      title: 'SISTEMA',
      items: [
        { id: 'settings', label: 'Configuración y Respaldo', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    onSelectView(id);
    onCloseMobileMenu();
  };

  const sidebarContent = (
    <div className="flex-1 min-h-0 flex flex-col justify-between py-4 px-3 overflow-y-auto pb-safe">
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    id={`nav-${item.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 px-3 space-y-3">
        <div className="lg:hidden">
          <PWAInstallButton variant="card" />
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Mayordomía RD
          </p>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-[11px] leading-tight">
            Tus datos se guardan en tu navegador en LocalStorage y funcionan sin conexión.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobileMenu}
          />
          <div className="relative w-[84vw] max-w-[300px] bg-white dark:bg-slate-900 h-dvh shadow-2xl flex flex-col z-10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Menú Mayordomo RD
              </span>
              <button
                onClick={onCloseMobileMenu}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
