import { forwardRef, type InputHTMLAttributes, type ReactElement } from 'react';
import { twMerge } from './twMerge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref): ReactElement => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink-700">
      <span>{label}</span>
      <input
        ref={ref}
        className={twMerge(
          'rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal focus:ring-2 focus:ring-teal/20',
          error ? 'border-coral focus:border-coral focus:ring-coral/20' : '',
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-coral">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
