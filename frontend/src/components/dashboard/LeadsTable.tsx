import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Lead } from '../../types/api';
import type { ReactElement } from 'react';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
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

export const LeadsTable = ({ leads, isLoading, onView, onEdit, onDelete }: LeadsTableProps): ReactElement => {
  if (isLoading) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <div className="h-5 w-40 animate-pulse rounded bg-ink-100" />
          <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-ink-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-100">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-[0.2em] text-ink-500">
            <tr>
              <th className="px-5 py-4">Lead</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Source</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {leads.map((lead) => (
              <tr key={lead._id} className="transition hover:bg-ink-50/70">
                <td className="px-5 py-4">
                  <button className="text-left" type="button" onClick={() => onView(lead)}>
                    <p className="font-semibold text-ink-900">{lead.name}</p>
                    <p className="text-sm text-ink-500">{lead.email}</p>
                  </button>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-ink-700">{lead.source}</td>
                <td className="px-5 py-4 text-sm text-ink-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => onView(lead)}>
                      View
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => onEdit(lead)}>
                      Edit
                    </Button>
                    <Button type="button" variant="danger" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
