import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { LoginValues, RegisterValues, UserRole } from '../../types/api';

interface AuthCardProps {
  onLogin: (values: LoginValues) => Promise<void>;
  onRegister: (values: RegisterValues) => Promise<void>;
}

const initialLogin = { email: '', password: '' };
const initialRegister = { name: '', email: '', password: '', role: 'Sales User' as UserRole };

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['Admin', 'Sales User']),
});

export const AuthCard = ({ onLogin, onRegister }: AuthCardProps): ReactElement => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialLogin,
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialRegister,
  });

  const handleLogin = loginForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await onLogin(values);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Authentication failed');
    }
  });

  const handleRegister = registerForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await onRegister(values);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Authentication failed');
    }
  });

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-glow backdrop-blur-xl lg:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal">GigFlow</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">Smart Leads Dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-ink-600">
          Sign in to manage leads, or create a new account to start tracking your pipeline.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-ink-100 p-1">
        <button
          type="button"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-ink-900 shadow' : 'text-ink-500'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-ink-900 shadow' : 'text-ink-500'}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form className="space-y-4" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
        {mode === 'register' ? (
          <>
            <Input
              label="Full name"
              placeholder="Ava Johnson"
              {...registerForm.register('name')}
              error={registerForm.formState.errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="ava@company.com"
              {...registerForm.register('email')}
              error={registerForm.formState.errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              {...registerForm.register('password')}
              error={registerForm.formState.errors.password?.message}
            />
            <Select
              label="Role"
              {...registerForm.register('role')}
              error={registerForm.formState.errors.role?.message}
            >
              <option value="Sales User">Sales User</option>
              <option value="Admin">Admin</option>
            </Select>
          </>
        ) : (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              {...loginForm.register('email')}
              error={loginForm.formState.errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              {...loginForm.register('password')}
              error={loginForm.formState.errors.password?.message}
            />
          </>
        )}

        {error ? <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={mode === 'login' ? loginForm.formState.isSubmitting : registerForm.formState.isSubmitting}>
          {(mode === 'login' ? loginForm.formState.isSubmitting : registerForm.formState.isSubmitting) ? 'Processing...' : mode === 'login' ? 'Login' : 'Create account'}
        </Button>
      </form>
    </div>
  );
};
