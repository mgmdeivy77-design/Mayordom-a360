import React, { useState } from 'react';
import { Utensils, Plus, ShoppingBag, Trash2, RotateCcw } from 'lucide-react';
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
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [notice, setNotice] = useState('');

  const currentDay = state.weeklyMenu[selectedDayIndex] || state.weeklyMenu[0];

  const handleMealChange = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', val: string) => {
    const updatedMenu = state.weeklyMenu.map((day, idx) =>
      idx === selectedDayIndex ? { ...day, [mealType]: val } : day
    );
    onUpdateWeeklyMenu(updatedMenu);
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName.trim()) return;
    const updatedMenu = state.weeklyMenu.map((day, idx) =>
      idx === selectedDayIndex
        ? {
            ...day,
            ingredients: [
              ...(day.ingredients || []),
              { name: ingName.trim(), qty: ingQty.trim() || '1 ud', category: 'Alimentos' },
            ],
          }
        : day
    );
    onUpdateWeeklyMenu(updatedMenu);
    setIngName('');
    setIngQty('');
    setNotice('');
  };

  const handleDeleteIngredient = (ingIdx: number) => {
    const updatedMenu = state.weeklyMenu.map((day, idx) =>
      idx === selectedDayIndex
        ? {
            ...day,
            ingredients: (day.ingredients || []).filter((_, i) => i !== ingIdx),
          }
        : day
    );
    onUpdateWeeklyMenu(updatedMenu);
  };

  const handleClearDay = () => {
    const updatedMenu = state.weeklyMenu.map((day, idx) =>
      idx === selectedDayIndex
        ? { ...day, breakfast: '', lunch: '', dinner: '', snack: '', estimatedCost: 0, ingredients: [] }
        : day
    );
    onUpdateWeeklyMenu(updatedMenu);
  };

  const handleClearWeek = () => {
    const cleared = state.weeklyMenu.map((day) => ({
      ...day,
      breakfast: '',
      lunch: '',
      dinner: '',
      snack: '',
      estimatedCost: 0,
      ingredients: [],
    }));
    onUpdateWeeklyMenu(cleared);
  };

  const handleSendToShoppingList = () => {
    const weekIngredients = state.weeklyMenu.flatMap((d) =>
      (d.ingredients || []).map((ing) => (ing.qty ? `${ing.name} (${ing.qty})` : ing.name))
    );

    if (weekIngredients.length === 0) {
      setNotice('Agrega ingredientes en tus días del menú antes de enviarlos a la lista de compras.');
      return;
    }

    setNotice('');
    onAddIngredientsToShoppingList(Array.from(new Set(weekIngredients)));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
            <Utensils className="w-4 h-4 shrink-0" />
            <span>Módulo de Alimentación Familiar</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Planificador de Menú Semanal RD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organiza tus comidas diarias, agrega ingredientes y envíalos directamente a tu lista de compras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearWeek}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar Semana
          </button>
          <button
            type="button"
            onClick={handleSendToShoppingList}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            Enviar Ingredientes a Lista de Compras
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {notice}
        </div>
      )}

      {/* Days Tabs */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar max-w-full">
          {state.weeklyMenu.map((d, idx) => (
            <button
              key={d.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedDayIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleClearDay}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Limpiar {currentDay.day}
        </button>
      </div>

      {/* Meals Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
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

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🍲 Almuerzo ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.lunch}
            onChange={(e) => handleMealChange('lunch', e.target.value)}
            placeholder="ej. La Bandera (Arroz blanco, habichuelas rojas, pollo guisado)..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🌙 Cena ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.dinner}
            onChange={(e) => handleMealChange('dinner', e.target.value)}
            placeholder="ej. Yuca con cebollita salteada y queso..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider">
            🍎 Merienda / Snacks ({currentDay.day})
          </label>
          <input
            type="text"
            value={currentDay.snack || ''}
            onChange={(e) => handleMealChange('snack', e.target.value)}
            placeholder="ej. Frutas frescas, yogurt o jugos naturales..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Ingredients Manager for Current Day */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Ingredientes Necesarios ({currentDay.day})
        </h3>

        <form onSubmit={handleAddIngredient} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={ingName}
            onChange={(e) => setIngName(e.target.value)}
            placeholder="Nombre del ingrediente (ej. Plátanos verdes, Pollo)"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none"
          />
          <input
            type="text"
            value={ingQty}
            onChange={(e) => setIngQty(e.target.value)}
            placeholder="Cantidad (ej. 2 lb, 6 uds)"
            className="w-full sm:w-40 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Añadir
          </button>
        </form>

        {(currentDay.ingredients || []).length === 0 ? (
          <p className="text-xs text-slate-400">
            No has agregado ingredientes para {currentDay.day}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(currentDay.ingredients || []).map((ing, idx) => (
              <span
                key={`${ing.name}-${idx}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>
                  {ing.name} {ing.qty ? `(${ing.qty})` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteIngredient(idx)}
                  className="text-slate-400 hover:text-rose-600"
                  title="Eliminar ingrediente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
