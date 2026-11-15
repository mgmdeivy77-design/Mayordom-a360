import React, { useState } from 'react';
import {
  Settings,
  User,
  Lock,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import { AppState } from '../types';
import { exportAppStateAsJson, normalizeAppState } from '../utils/storage';
import { initialAppState } from '../data/initialData';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface SettingsViewProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, onUpdateState }) => {
  const [familyName, setFamilyName] = useState(state.profile.familyName);
  const [membersCount, setMembersCount] = useState(String(state.profile.familyMembersCount));
  const [province, setProvince] = useState(state.profile.province);
  const [currency, setCurrency] = useState(state.settings.currency);
  const [enableStewardship, setEnableStewardship] = useState(state.settings.enableStewardshipModule);
  const [pinCode, setPinCode] = useState(state.settings.securityPin || '');
  const [enablePin, setEnablePin] = useState(state.settings.pinEnabled);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (enablePin && !/^\d{4}$/.test(pinCode)) {
      showToast('error', 'El PIN de seguridad debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    const updated: AppState = {
      ...state,
      profile: {
        ...state.profile,
        familyName,
        familyMembersCount: parseInt(membersCount, 10) || 1,
        province,
      },
      settings: {
        ...state.settings,
        currency,
        enableStewardshipModule: enableStewardship,
        pinEnabled: enablePin,
        securityPin: enablePin ? pinCode : null,
      },
    };

    onUpdateState(updated);
    showToast('success', 'Configuración guardada correctamente en tu dispositivo.');
  };

  const handleBackup = () => {
    exportAppStateAsJson(state);
    showToast('success', 'Respaldo JSON descargado.');
  };

  const handleConfirmReset = () => {
    onUpdateState(initialAppState);
    setFamilyName(initialAppState.profile.familyName);
    setMembersCount(String(initialAppState.profile.familyMembersCount));
    setProvince(initialAppState.profile.province);
    setCurrency(initialAppState.settings.currency);
    setEnableStewardship(initialAppState.settings.enableStewardshipModule);
    setEnablePin(initialAppState.settings.pinEnabled);
    setPinCode(initialAppState.settings.securityPin || '');
    setConfirmResetOpen(false);
    showToast('success', 'Todos los datos se han reiniciado en blanco correctamente.');
  };

  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.transactions)) {
          onUpdateState(normalizeAppState(parsed));
          showToast('success', '¡Respaldo restaurado con éxito!');
        } else {
          showToast('error', 'El archivo JSON no corresponde a un respaldo válido de Mayordomo RD.');
        }
      } catch {
        showToast('error', 'No se pudo leer el archivo JSON. Verifica que no esté dañado.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`flex items-center gap-2.5 p-3.5 sm:p-4 rounded-2xl border text-xs font-bold shadow-sm ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Módulo de Configuración del Sistema</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Ajustes, App Android & Seguridad
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Instala la aplicación en tu teléfono Android, configura tu PIN de seguridad y respalda tus finanzas.
        </p>
      </div>

      {/* PWA Install & Mobile Experience Card */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
          Aplicación Móvil (PWA Android / Sin Conexión)
        </h3>
        <PWAInstallButton variant="card" />
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-6">
        {/* Family Profile */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 shrink-0" />
            Perfil de la Familia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Nombre de la Familia *</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Integrantes en el Hogar</label>
              <input
                type="number"
                min="1"
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Provincia (Rep. Dom.)</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security & System Options */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
            Seguridad & Módulos Opcionales
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Bloqueo por PIN de Seguridad (4 dígitos)
                </span>
                <p className="text-xs text-slate-500">
                  Exige ingresar un PIN al abrir la aplicación para proteger tu privacidad financiera.
                </p>
              </div>

              <input
                type="checkbox"
                checked={enablePin}
                onChange={(e) => setEnablePin(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded shrink-0"
              />
            </div>

            {enablePin && (
              <div>
                <label className="block text-xs font-semibold mb-1">PIN de 4 dígitos *</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  className="w-36 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center tracking-widest text-lg"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Módulo de Mayordomía Cristiana
                </span>
                <p className="text-xs text-slate-500">
                  Activa el cálculo de diezmos (10%), ofrendas y principios bíblicos de administración.
                </p>
              </div>

              <input
                type="checkbox"
                checked={enableStewardship}
                onChange={(e) => setEnableStewardship(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded shrink-0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition-transform active:scale-95"
          >
            Guardar Configuración
          </button>
        </div>
      </form>

      {/* Backup & Restore Data */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-600 shrink-0" />
          Respaldo & Restauración de Datos (LocalStorage)
        </h3>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleBackup}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            Descargar Respaldo JSON
          </button>

          <label className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/60">
            <Upload className="w-4 h-4" />
            <span>Restaurar desde JSON</span>
            <input type="file" accept=".json" onChange={handleRestoreJSON} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold rounded-xl text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Datos en Blanco
          </button>
        </div>
      </div>

      {/* Custom In-App Confirmation Modal (no window.confirm) */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4 pb-safe">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                ¿Reiniciar todos los datos en blanco?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Esta acción eliminará tus transacciones, presupuestos, metas y registros actuales para dejar la aplicación completamente limpia. Te recomendamos descargar un respaldo JSON primero.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white"
              >
                Sí, reiniciar en blanco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
