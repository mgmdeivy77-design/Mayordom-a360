import React, { useState } from 'react';
import { Lock, Delete, CheckCircle2, ShieldCheck } from 'lucide-react';
import { setPinUnlocked } from '../utils/storage';

interface PinModalProps {
  correctPin: string;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ correctPin, onSuccess }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePressNum = (num: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + num;
      setEnteredPin(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (next === correctPin) {
          setPinUnlocked(true);
          onSuccess();
        } else {
          setErrorMsg('PIN incorrecto. Inténtalo de nuevo.');
          setEnteredPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200 my-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner">
          <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
          Mayordomo Familiar RD
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 sm:mb-6">
          Ingresa tu PIN de seguridad de 4 dígitos
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 mb-5 sm:mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                idx < enteredPin.length
                  ? 'bg-blue-600 border-blue-600 scale-110'
                  : 'border-slate-300 dark:border-slate-700 bg-transparent'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-red-500 font-semibold mb-4 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handlePressNum(num)}
              className="h-12 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg active:scale-95 transition-all shadow-xs"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePressNum('0')}
            className="h-12 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg active:scale-95 transition-all shadow-xs"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-all"
            title="Borrar"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
