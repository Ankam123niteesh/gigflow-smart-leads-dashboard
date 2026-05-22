import { Badge } from '../ui/Badge';
import type { ReactElement } from 'react';

interface StatsBarProps {
  totalLeads: number;
  currentPage: number;
  totalPages: number;
  role: string;
}

export const StatsBar = ({ totalLeads, currentPage, totalPages, role }: StatsBarProps): ReactElement => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.75rem] bg-ink-900 p-5 text-white shadow-glow">
        <p className="text-sm text-white/70">Pipeline</p>
        <p className="mt-2 font-display text-3xl font-bold">{totalLeads}</p>
        <p className="mt-1 text-sm text-white/70">Leads across the active filter set</p>
      </div>
      <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
        <p className="text-sm text-ink-500">Pagination</p>
        <p className="mt-2 font-display text-3xl font-bold text-ink-900">
          {currentPage}/{totalPages || 1}
        </p>
        <p className="mt-1 text-sm text-ink-600">10 leads per page from the backend</p>
      </div>
      <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
        <p className="text-sm text-ink-500">Access</p>
        <div className="mt-2 flex items-center gap-3">
          <Badge tone={role === 'Admin' ? 'gold' : 'teal'}>{role}</Badge>
        </div>
        <p className="mt-3 text-sm text-ink-600">Role-based UI reflects the JWT session.</p>
      </div>
    </div>
  );
};
