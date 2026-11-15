import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, Check, Tag, Wallet, Receipt } from 'lucide-react';
import { AppState } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'income' | 'expense';
  state: AppState;
  onAddCategory: (kind: 'income' | 'expense', name: string) => void;
  onRenameCategory: (kind: 'income' | 'expense', oldName: string, newName: string) => void;
  onDeleteCategory: (kind: 'income' | 'expense', name: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'expense',
  state,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(initialTab);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories =
    activeTab === 'income'
      ? state.settings.incomeCategories || []
      : state.settings.expenseCategories || [];

  const getUsageCount = (catName: string) => {
    return state.transactions.filter(
      (t) => t.type === activeTab && t.category === catName
    ).length;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Esa categoría ya existe en la lista.');
      return;
    }
    onAddCategory(activeTab, trimmed);
    setNewCategoryName('');
    setErrorMsg('');
  };

  const handleStartEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
    setErrorMsg('');
  };

  const handleSaveEdit = (oldName: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setErrorMsg('El nombre no puede estar vacío.');
      return;
    }
    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrorMsg('Ya existe otra categoría con ese nombre.');
      return;
    }
    if (trimmed !== oldName) {
      onRenameCategory(activeTab, oldName, trimmed);
    }
    setEditingCategory(null);
    setEditValue('');
    setErrorMsg('');
  };

  const handleDelete = (cat: string) => {
    if (categories.length <= 1) {
      setErrorMsg('Debe quedar al menos una categoría disponible.');
      return;
    }
    onDeleteCategory(activeTab, cat);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                Administrar Categorías
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                Añade, renombra o elimina categorías de entradas y gastos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('income');
                setEditingCategory(null);
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Entradas ({(state.settings.incomeCategories || []).length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('expense');
                setEditingCategory(null);
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Gastos ({(state.settings.expenseCategories || []).length})
            </button>
          </div>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAdd} className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setErrorMsg('');
              }}
              placeholder={
                activeTab === 'income'
                  ? 'Nueva categoría de entrada (ej. Dividendos, Ventas)...'
                  : 'Nueva categoría de gasto (ej. Gimnasio, Streaming)...'
              }
              className="min-w-0 flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 shrink-0 ${
                activeTab === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
          </div>
          {errorMsg && (
            <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </p>
          )}
        </form>

        {/* Category List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {categories.map((cat) => {
            const count = getUsageCount(cat);
            const isEditing = editingCategory === cat;

            return (
              <div
                key={cat}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveEdit(cat);
                        } else if (e.key === 'Escape') {
                          setEditingCategory(null);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-blue-500 rounded-lg text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      title="Guardar nombre"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {cat}
                      </span>
                      {count > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                          {count} reg.
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg"
                        title="Editar nombre"
                        aria-label="Editar nombre"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                        title="Eliminar categoría"
                        aria-label="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center bg-slate-50/70 dark:bg-slate-900 pb-safe">
          <span className="text-[11px] text-slate-500">
            Al renombrar, se actualizan tus movimientos y presupuestos automáticamente.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-xl shrink-0"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
