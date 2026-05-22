import type { ReactNode } from 'react';
import type { ReactElement } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps): ReactElement => {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-ink-200 bg-white/70 p-10 text-center">
      <h3 className="font-display text-xl font-bold text-ink-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
};
