const tokenKey = 'gigflow_token';

export const readToken = (): string | null => {
  return localStorage.getItem(tokenKey);
};

export const writeToken = (token: string): void => {
  localStorage.setItem(tokenKey, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(tokenKey);
};
