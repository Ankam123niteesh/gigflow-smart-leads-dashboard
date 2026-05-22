import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { LeadFilters } from '../../types/api';
import type { ReactElement } from 'react';

interface FiltersBarProps {
  filters: LeadFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (patch: Partial<LeadFilters>) => void;
  onCreateLead: () => void;
  onExportCsv: () => void;
}

export const FiltersBar = ({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  onCreateLead,
  onExportCsv,
}: FiltersBarProps): ReactElement => {
  return (
    <div className="rounded-[2rem] border border-ink-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_auto_auto]">
        <Input label="Search" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by name or email" />
        <Select label="Status" value={filters.status} onChange={(event) => onFilterChange({ status: event.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </Select>
        <Select label="Source" value={filters.source} onChange={(event) => onFilterChange({ source: event.target.value, page: 1 })}>
          <option value="">All sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </Select>
        <Select label="Sort" value={filters.sort} onChange={(event) => onFilterChange({ sort: event.target.value as LeadFilters['sort'], page: 1 })}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </Select>
        <Button type="button" className="self-end" onClick={onCreateLead}>
          New lead
        </Button>
        <Button type="button" variant="secondary" className="self-end" onClick={onExportCsv}>
          Export CSV
        </Button>
      </div>
    </div>
  );
};
