import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  ShoppingBag,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenQuickAdd: () => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onSelectView,
  onOpenQuickAdd,
  onOpenMobileMenu,
}) => {
  const navItemClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl transition-colors min-w-[56px] ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 font-bold'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <nav
      aria-label="Navegación móvil Android"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around px-2 pt-1">
        <button
          onClick={() => onSelectView('dashboard')}
          className={navItemClass(activeView === 'dashboard')}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Inicio</span>
        </button>

        <button
          onClick={() => onSelectView('expenses')}
          className={navItemClass(activeView === 'expenses')}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Gastos</span>
        </button>

        <button
          onClick={onOpenQuickAdd}
          aria-label="Registrar movimiento rápido"
          className="flex items-center justify-center -mt-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => onSelectView('shopping-list')}
          className={navItemClass(activeView === 'shopping-list')}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Compras</span>
        </button>

        <button
          onClick={onOpenMobileMenu}
          className={navItemClass(false)}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Módulos</span>
        </button>
      </div>
    </nav>
  );
};
