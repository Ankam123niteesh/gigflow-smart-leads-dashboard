import type { ReactElement } from 'react';

export const Spinner = ({ label = 'Loading' }: { label?: string }): ReactElement => {
  return (
    <div className="flex items-center gap-3 text-ink-600">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-300 border-t-teal" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
