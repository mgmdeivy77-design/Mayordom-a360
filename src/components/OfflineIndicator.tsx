import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:right-auto z-40 flex items-center justify-center sm:justify-start gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Modo sin conexión — Tus datos locales siguen activos.</span>
    </div>
  );
};
