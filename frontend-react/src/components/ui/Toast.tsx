import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  statusCode?: number;
  traceId?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  key?: React.Key;
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles = {
    error: 'bg-rose-900/95 text-white border-rose-700/50 shadow-rose-950/30 dark:bg-rose-900/95',
    success: 'bg-emerald-900/95 text-white border-emerald-700/50 shadow-emerald-950/30 dark:bg-emerald-900/95',
    warning: 'bg-amber-900/95 text-white border-amber-700/50 shadow-amber-950/30 dark:bg-amber-900/95',
    info: 'bg-indigo-900/95 text-white border-indigo-700/50 shadow-indigo-950/30 dark:bg-indigo-900/95',
  }[toast.type];

  const Icon = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all ${bgStyles}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <p className="font-bold text-xs uppercase tracking-wider opacity-90 mb-0.5">
            {toast.title} {toast.statusCode ? `(${toast.statusCode})` : ''}
          </p>
        )}
        <p className="text-xs font-medium leading-relaxed break-words">{toast.message}</p>
        {toast.traceId && (
          <p className="text-[9px] opacity-60 font-mono mt-1 truncate">TraceID: {toast.traceId}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
