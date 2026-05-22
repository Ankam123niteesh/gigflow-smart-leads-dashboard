import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthCard } from './components/auth/AuthCard';
import { Button } from './components/ui/Button';
import { EmptyState } from './components/ui/EmptyState';
import { ErrorState } from './components/ui/ErrorState';
import { Spinner } from './components/ui/Spinner';
import { FiltersBar } from './components/dashboard/FiltersBar';
import { LeadDetailModal } from './components/dashboard/LeadDetailModal';
import { LeadFormModal } from './components/dashboard/LeadFormModal';
import { LeadsTable } from './components/dashboard/LeadsTable';
import { StatsBar } from './components/dashboard/StatsBar';
import { leadsApi } from './lib/api';
import { downloadLeadsCsv } from './lib/csv';
import { useDebounce } from './hooks/useDebounce';
import { useAuth } from './context/AuthContext';
import type { Lead, LeadFilters, LeadFormValues } from './types/api';

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

const App = (): ReactElement => {
  const { user, token, isLoading, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 400);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  useEffect(() => {
    setFilters((currentFilters) => ({ ...currentFilters, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchLeads = async (): Promise<void> => {
      setIsLoadingLeads(true);
      setError(null);

      try {
        const response = await leadsApi.list(token, filters);
        setLeads(response.leads);
        setTotalLeads(response.totalLeads);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Could not load leads');
      } finally {
        setIsLoadingLeads(false);
      }
    };

    void fetchLeads();
  }, [filters, token]);

  const isDashboardEmpty = useMemo(() => !isLoadingLeads && leads.length === 0 && !error, [error, isLoadingLeads, leads.length]);

  const updateFilters = (patch: Partial<LeadFilters>): void => {
    setFilters((currentFilters) => ({ ...currentFilters, ...patch }));
  };

  const handleCreateLead = async (values: LeadFormValues): Promise<void> => {
    if (!token) {
      return;
    }

    await leadsApi.create(token, values);
    setIsCreateOpen(false);
    await refreshLeadData();
  };

  const handleUpdateLead = async (values: LeadFormValues): Promise<void> => {
    if (!token || !activeLead) {
      return;
    }

    await leadsApi.update(token, activeLead._id, values);
    setIsEditOpen(false);
    setActiveLead(null);
    await refreshLeadData();
  };

  const handleDeleteLead = async (lead: Lead): Promise<void> => {
    if (!token) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${lead.name}?`);
    if (!shouldDelete) {
      return;
    }

    await leadsApi.remove(token, lead._id);
    setActiveLead(null);
    setIsEditOpen(false);
    await refreshLeadData();
  };

  const refreshLeadData = async (): Promise<void> => {
    if (!token) {
      return;
    }

    const response = await leadsApi.list(token, filters);
    setLeads(response.leads);
    setTotalLeads(response.totalLeads);
    setTotalPages(response.totalPages);
    setCurrentPage(response.currentPage);
  };

  const exportCsv = async (): Promise<void> => {
    if (!token) {
      return;
    }

    const firstPage = await leadsApi.list(token, { ...filters, page: 1 });
    const pages = Array.from({ length: firstPage.totalPages }, (_, index) => index + 1);
    const allLeads = await Promise.all(pages.map(async (page) => leadsApi.list(token, { ...filters, page })));
    downloadLeadsCsv(allLeads.flatMap((pageResponse) => pageResponse.leads));
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dashboard px-6 text-white">
        <Spinner label="Loading session" />
      </div>
    );
  }

  const authView = (
    <main className="min-h-screen bg-dashboard px-4 py-6 text-ink-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="max-w-xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sand/80">GigFlow</p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">Smart leads, sharper follow-up, cleaner pipeline control.</h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/80">
            A role-aware sales dashboard for teams that need fast lead capture, filterable pipelines, and a reliable workflow across every follow-up stage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">JWT auth</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">MongoDB</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">CSV export</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Responsive UI</span>
          </div>
        </section>
        <div className="flex justify-center lg:justify-end">
          <AuthCard onLogin={login} onRegister={register} />
        </div>
      </div>
    </main>
  );

  const dashboardView = (
    <main className="min-h-screen bg-dashboard px-4 py-4 text-ink-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl pb-12 pt-4 lg:pt-6">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 text-white shadow-glow backdrop-blur-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sand/80">GigFlow</p>
              <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Smart Leads Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Manage leads, apply combined filters, and keep your team focused on the next best action.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:min-w-[240px]">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Signed in as</p>
                <p className="mt-1 font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-white/70">{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(true)}>
                  Create lead
                </Button>
                <Button type="button" variant="danger" onClick={handleLogout} className="w-full sm:w-auto">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <StatsBar totalLeads={totalLeads} currentPage={currentPage} totalPages={totalPages} role={user?.role ?? 'Sales User'} />

          <FiltersBar
            filters={filters}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onFilterChange={updateFilters}
            onCreateLead={() => setIsCreateOpen(true)}
            onExportCsv={() => void exportCsv()}
          />

          {error ? <ErrorState title="Unable to load leads" description={error} onRetry={() => void refreshLeadData()} /> : null}

          {isDashboardEmpty ? (
            <EmptyState
              title="No leads yet"
              description="Create the first lead to start populating the dashboard and unlock search, filtering, and exports."
              action={<Button onClick={() => setIsCreateOpen(true)}>Add lead</Button>}
            />
          ) : (
            <LeadsTable
              leads={leads}
              isLoading={isLoadingLeads}
              onView={(lead) => setActiveLead(lead)}
              onEdit={(lead) => {
                setActiveLead(lead);
                setIsEditOpen(true);
              }}
              onDelete={(lead) => void handleDeleteLead(lead)}
            />
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2">
              <Button type="button" variant="secondary" disabled={filters.page <= 1} onClick={() => updateFilters({ page: filters.page - 1 })}>
                Previous
              </Button>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm">
                Page {filters.page} of {totalPages}
              </span>
              <Button type="button" variant="secondary" disabled={filters.page >= totalPages} onClick={() => updateFilters({ page: filters.page + 1 })}>
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isCreateOpen ? (
        <LeadFormModal
          onClose={() => setIsCreateOpen(false)}
          onSave={async (values) => {
            await handleCreateLead(values);
          }}
        />
      ) : null}

      {isEditOpen && activeLead ? (
        <LeadFormModal
          lead={activeLead}
          onClose={() => setIsEditOpen(false)}
          onSave={async (values) => {
            await handleUpdateLead(values);
          }}
        />
      ) : null}

      {!isEditOpen && activeLead ? (
        <LeadDetailModal
          lead={activeLead}
          onClose={() => setActiveLead(null)}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => void handleDeleteLead(activeLead)}
        />
      ) : null}
    </main>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : authView} />
      <Route path="/" element={user ? dashboardView : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
};

export default App;
