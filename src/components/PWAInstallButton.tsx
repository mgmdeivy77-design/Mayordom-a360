import React, { useState } from 'react';
import { Download, Smartphone, Share, MoreVertical, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Aplicación instalada en modo nativo
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80">
              Estás ejecutando Mayordomo Familiar RD como app independiente y lista para funcionar sin conexión.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted && (isAndroid || isIOS)) {
        setShowGuideModal(true);
      }
      return;
    }
    setShowGuideModal(true);
  };

  if (!isInstallable && !isIOS && !isAndroid && variant === 'compact') {
    return null;
  }

  return (
    <>
      {variant === 'compact' ? (
        <button
          onClick={handleAction}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3 py-2 text-xs font-bold shadow-xs transition-transform active:scale-95"
          title="Instalar App en tu celular"
          id="pwa-install-btn"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Instalar en tu Celular Android / Móvil</h4>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Úsala en pantalla completa desde tu inicio, con acceso sin internet y carga instantánea.
              </p>
            </div>
          </div>
          <button
            onClick={handleAction}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shrink-0 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            {isInstallable ? 'Instalar Ahora' : 'Cómo Instalar'}
          </button>
        </div>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto pb-safe">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {isIOS ? 'Instalar en iPhone / iPad' : 'Instalar en Android (Chrome)'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <Share className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <Download className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    2. Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong>.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <MoreVertical className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    1. Abre el menú de Google Chrome tocando los <strong>tres puntos (⋮)</strong> arriba a la derecha.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <Download className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    2. Toca <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla principal</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    3. Confirma tocando <strong>Instalar</strong> y aparecerá el ícono de Mayordomo RD en tu Android.
                  </span>
                </li>
              </ol>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
