import type { ReactNode } from 'react';
import type { ReactElement } from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  onRetry?: () => void;
}

export const ErrorState = ({ title, description, action, onRetry }: ErrorStateProps): ReactElement => {
  return (
    <div className="rounded-[1.75rem] border border-coral/20 bg-coral/5 p-6 text-center text-ink-900">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-ink-700">{description}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        {action}
        {onRetry ? (
          <Button type="button" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
};
