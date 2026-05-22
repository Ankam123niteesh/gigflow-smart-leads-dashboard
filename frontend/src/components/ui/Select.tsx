import { forwardRef, type ReactElement, type SelectHTMLAttributes } from 'react';
import { twMerge } from './twMerge';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string | undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className = '', children, ...props }, ref): ReactElement => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink-700">
      <span>{label}</span>
      <select
        ref={ref}
        className={twMerge(
          'rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20',
          error ? 'border-coral focus:border-coral focus:ring-coral/20' : '',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs font-medium text-coral">{error}</span> : null}
    </label>
  );
});

Select.displayName = 'Select';
