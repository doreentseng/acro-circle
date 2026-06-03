import { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
};

export default function FormField({
  label,
  required = false,
  children,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="text-sm text-zinc-600 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      {/* Field (input / select / checkbox / radio) */}
      {children}

      {/* Error (optional future use) */}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
