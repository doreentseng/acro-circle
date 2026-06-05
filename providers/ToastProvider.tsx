'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'delete';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = Date.now();

      setTimeout(() => {
        setToasts((prev) => [{ id, message, type }, ...prev]);
      }, 500);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return ctx;
}
