import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { twMerge } from './twMerge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 shadow-glow',
  secondary: 'bg-white text-ink-900 border border-ink-200 hover:border-ink-300',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
  danger: 'bg-coral text-white hover:opacity-90',
};

export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps): ReactElement => {
  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
