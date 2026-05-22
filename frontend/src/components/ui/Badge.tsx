import type { ReactNode } from 'react';
import type { ReactElement } from 'react';
import { twMerge } from './twMerge';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'teal' | 'coral' | 'gold';
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  teal: 'bg-teal/10 text-teal',
  coral: 'bg-coral/10 text-coral',
  gold: 'bg-gold/15 text-gold',
};

export const Badge = ({ children, tone = 'neutral', className = '' }: BadgeProps): ReactElement => {
  return <span className={twMerge('inline-flex rounded-full px-3 py-1 text-xs font-semibold', toneClasses[tone], className)}>{children}</span>;
};
