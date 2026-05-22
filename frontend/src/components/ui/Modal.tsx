import type { ReactNode } from 'react';
import type { ReactElement } from 'react';
import { Button } from './Button';

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, description, children, onClose }: ModalProps): ReactElement => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-riseIn rounded-[2rem] bg-sand p-6 shadow-glow lg:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-ink-600">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
