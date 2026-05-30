'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import type { ToastType } from '@/types';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const typeClasses: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
};

function ToastItem({ id, type, message }: { id: string; type: ToastType; message: string }) {
  const { removeToast } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium min-w-[280px] max-w-sm',
        'animate-slide-in-right',
        typeClasses[type],
      )}
      role="alert"
    >
      <span className="shrink-0 mt-0.5">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
