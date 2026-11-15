import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Lock,
  Sun,
  Moon,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { AppState } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  state: AppState;
  activeView: string;
  onSelectView: (view: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
  onOpenAlerts?: () => void;
  onLockApp?: () => void;
  alertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  activeView,
  onSelectView,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenQuickAdd,
  onOpenAlerts,
  onLockApp,
  alertCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left: Mobile Menu + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Abrir Menú"
            id="mobile-menu-btn"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2.5 text-left group"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                  Mayordomo
                </span>
                <span className="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  RD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Finanzas & Mayordomía Familiar
              </p>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700"
            id="global-search-trigger"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Buscar movimientos, deudas, productos...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-transform active:scale-95"
            id="quick-add-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Registro</span>
          </button>

          {/* Search button mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Alert Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Alertas Financieras"
            id="alerts-bell-btn"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            id="theme-toggle-btn"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* PIN Lock button */}
          {state?.settings?.pinEnabled && (
            <button
              onClick={onLockApp}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Bloquear Aplicación"
              id="lock-app-btn"
            >
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
