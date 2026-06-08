'use client';

import {
  XCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

type AlertType = 'error' | 'success' | 'info';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const EMPTY_ALERT_DATA: AlertProps = {
  title: '',
  message: '',
};

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className,
}: AlertProps) {
  const base =
    'w-full rounded-lg border px-4 py-3 flex items-start gap-3 transition';

  const styles = {
    error:
      'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-900',
    success:
      'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900',
  };

  return (
    <div className={`${className} ${base} ${styles[type]}`}>
      {/* Icon */}
      <div className="mt-0.5">
        {type === 'error' && <XCircleIcon className="w-5 h-5" />}
        {type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
        {type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
      </div>

      <div className="flex-1">
        {title && <div className="font-semibold text-sm mb-0.5">{title}</div>}
        <div className="text-sm leading-relaxed">{message}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-sm opacity-60 hover:opacity-100 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}
