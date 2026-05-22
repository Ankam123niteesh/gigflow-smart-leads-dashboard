import type { Lead } from '../types/api';

const escapeCell = (value: string): string => {
  return `"${value.replaceAll('"', '""')}"`;
};

export const downloadLeadsCsv = (leads: Lead[]): void => {
  const rows = [
    ['Name', 'Email', 'Status', 'Source', 'Created At'],
    ...leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, new Date(lead.createdAt).toLocaleString()]),
  ];

  const csvContent = rows.map((row) => row.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gigflow-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
