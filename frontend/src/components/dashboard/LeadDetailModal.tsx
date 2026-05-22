import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import type { Lead } from '../../types/api';
import type { ReactElement } from 'react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusTone = (status: Lead['status']): 'neutral' | 'teal' | 'coral' | 'gold' => {
  switch (status) {
    case 'New':
      return 'gold';
    case 'Contacted':
      return 'teal';
    case 'Qualified':
      return 'neutral';
    case 'Lost':
      return 'coral';
    default:
      return 'neutral';
  }
};

export const LeadDetailModal = ({ lead, onClose, onEdit, onDelete }: LeadDetailModalProps): ReactElement => {
  return (
    <Modal title="Lead details" description="Review and act on a single lead." onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-ink-500">Name</p>
          <p className="mt-1 text-lg font-semibold text-ink-900">{lead.name}</p>
        </div>
        <div>
          <p className="text-sm text-ink-500">Email</p>
          <p className="mt-1 text-lg font-semibold text-ink-900">{lead.email}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-ink-500">Status</p>
            <div className="mt-1"><Badge tone={statusTone(lead.status)}>{lead.status}</Badge></div>
          </div>
          <div>
            <p className="text-sm text-ink-500">Source</p>
            <p className="mt-1 text-lg font-semibold text-ink-900">{lead.source}</p>
          </div>
          <div>
            <p className="text-sm text-ink-500">Created</p>
            <p className="mt-1 text-lg font-semibold text-ink-900">{new Date(lead.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
