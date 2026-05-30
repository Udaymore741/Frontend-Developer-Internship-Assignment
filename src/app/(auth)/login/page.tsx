'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { loginSchema } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, addToast } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ?? '',
        password: fieldErrors.password?.[0] ?? '',
      });
      return;
    }

    try {
      await login(result.data.email, result.data.password);
      router.push('/dashboard');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <Card padding="lg">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4">
          <span className="text-white text-xl font-bold">T</span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Welcome back</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Sign in to your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="alex@demo.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          error={errors.email}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          error={errors.password}
          leftIcon={<Lock size={16} />}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-1">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Demo credentials: <span className="font-mono">alex@demo.com</span> /{' '}
        <span className="font-mono">password123</span>
      </p>
    </Card>
  );
}
