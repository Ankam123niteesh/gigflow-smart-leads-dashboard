import { createContext, useContext, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { authApi } from '../lib/api';
import { clearToken, readToken, writeToken } from '../lib/storage';
import type { AuthResponse, AuthUser, LoginValues, RegisterValues } from '../types/api';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeAuth = (response: AuthResponse): { user: AuthUser; token: string } => ({
  user: response.user,
  token: response.token,
});

export const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => readToken());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadUser = async (): Promise<void> => {
      try {
        const response = await authApi.me(token);
        setUser(response.user);
      } catch {
        clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [token]);

  const persistAuth = (response: AuthResponse): void => {
    const normalized = normalizeAuth(response);
    writeToken(normalized.token);
    setToken(normalized.token);
    setUser(normalized.user);
  };

  const login = async (values: LoginValues): Promise<void> => {
    const response = await authApi.login(values);
    persistAuth(response);
  };

  const register = async (values: RegisterValues): Promise<void> => {
    const response = await authApi.register(values);
    persistAuth(response);
  };

  const logout = (): void => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) {
      return;
    }

    const response = await authApi.me(token);
    setUser(response.user);
  };

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
