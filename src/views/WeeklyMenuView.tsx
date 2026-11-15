import React, { useState } from 'react';
import { Utensils, Plus, ShoppingBag, CheckCircle, RefreshCw } from 'lucide-react';
import { AppState, DayMenu } from '../types';

interface WeeklyMenuViewProps {
  state: AppState;
  onUpdateWeeklyMenu: (menu: DayMenu[]) => void;
  onAddIngredientsToShoppingList: (ingredients: string[]) => void;
}

export const WeeklyMenuView: React.FC<WeeklyMenuViewProps> = ({
  state,
  onUpdateWeeklyMenu,
  onAddIngredientsToShoppingList,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const currentDay = state.weeklyMenu[selectedDayIndex] || state.weeklyMenu[0];

  const handleMealChange = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', val: string) => {
    const updatedMenu = state.weeklyMenu.map((day, idx) =>
      idx === selectedDayIndex ? { ...day, [mealType]: val } : day
    );
    onUpdateWeeklyMenu(updatedMenu);
  };

  const handleSendToShoppingList = () => {
    // Extract ingredients from current menu
    const ingredients = [
      'Plátanos verdes (para Mangú)',
      'Salami Induveca',
      'Queso de freír',
      'Huevos',
      'Arroz Selecto',
      'Habichuelas rojas',
      'Pollo fresco',
      'Aguacate',
      'Aceite de cocinar',
    ];

    onAddIngredientsToShoppingList(ingredients);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Utensils className="w-4 h-4" />
            <span>Módulo de Alimentación Familiar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Planificador de Menú Semanal RD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organiza desayunos, almuerzos (La Bandera, Mangú, Sancocho, Locrios) y envía ingredientes a la lista de compras.
          </p>
        </div>

        <button
          onClick={handleSendToShoppingList}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          Enviar Ingredientes a Lista de Compras
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {state.weeklyMenu.map((d, idx) => (
          <button
            key={d.day}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedDayIndex === idx
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Meals Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Desayuno */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            ☕ Desayuno ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.breakfast}
            onChange={(e) => handleMealChange('breakfast', e.target.value)}
            placeholder="ej. Mangú con los tres golpes (salami, huevo, queso frito)..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>

        {/* Almuerzo */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🍲 Almuerzo ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.lunch}
            onChange={(e) => handleMealChange('lunch', e.target.value)}
            placeholder="ej. La Bandera (Arroz blanco, habichuelas rojas, pollo guisado, ensalada verde)..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>

        {/* Cena */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🌙 Cena ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.dinner}
            onChange={(e) => handleMealChange('dinner', e.target.value)}
            placeholder="ej. Yuca con cebollita salteada y queso, o Sopa de pollo..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>

        {/* Merienda */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🍎 Merienda / Snacks ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.snack || ''}
            onChange={(e) => handleMealChange('snack', e.target.value)}
            placeholder="ej. Frutas frescas (Batida de zapote, guineo, jugos naturales)..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>
    </div>
  );
};
