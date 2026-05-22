import type {
  AuthResponse,
  AuthUser,
  Lead,
  LeadFilters,
  LeadFormValues,
  LeadListResponse,
  LoginValues,
  RegisterValues,
} from '../types/api';

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL is not defined');
}

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
  query?: Record<string, string | number | undefined>;
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>): string => {
  const url = new URL(path, apiBaseUrl);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new ApiError(response.status, payload?.message ?? 'Request failed');
  }

  return payload as T;
}

export const authApi = {
  register: (values: RegisterValues): Promise<AuthResponse> => request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  }),
  login: (values: LoginValues): Promise<AuthResponse> => request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  }),
  me: (token: string): Promise<{ user: AuthUser }> => request<{ user: AuthUser }>('/api/auth/me', {
    method: 'GET',
    token,
  }),
};

export const leadsApi = {
  list: (token: string, filters: LeadFilters): Promise<LeadListResponse> =>
    request<LeadListResponse>('/api/leads', {
      method: 'GET',
      token,
      query: {
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort,
        page: filters.page,
      },
    }),
  getOne: async (token: string, id: string): Promise<{ lead: Lead }> => request<{ lead: Lead }>(`/api/leads/${id}`, {
    method: 'GET',
    token,
  }),
  create: (token: string, values: LeadFormValues): Promise<{ lead: Lead }> => request<{ lead: Lead }>('/api/leads', {
    method: 'POST',
    token,
    body: JSON.stringify(values),
  }),
  update: (token: string, id: string, values: Partial<LeadFormValues>): Promise<{ lead: Lead }> => request<{ lead: Lead }>(`/api/leads/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(values),
  }),
  remove: (token: string, id: string): Promise<{ message: string }> => request<{ message: string }>(`/api/leads/${id}`, {
    method: 'DELETE',
    token,
  }),
};
