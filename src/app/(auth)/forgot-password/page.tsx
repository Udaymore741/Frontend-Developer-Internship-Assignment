'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0] ?? '');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <Card padding="lg">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      {submitted ? (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle size={28} />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Check your email</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We sent a password reset link to{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
          </p>
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Back to login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reset password</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="alex@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              Send reset link
            </Button>
          </form>
        </>
      )}
    </Card>
  );
}
