'use client';

import { useState } from 'react';
import { useTeam } from '@/context/TeamContext';
import { useAuth } from '@/context/AppContext';
import { memberSchema } from '@/lib/validators';
import type { MemberFormData } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const selectClass = cn(
  'w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm',
  'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
);

const EMPTY: MemberFormData = { name: '', email: '', role: 'developer', department: '', avatar: '' };

export function MemberFormModal({ isOpen, onClose }: MemberFormModalProps) {
  const { addMember } = useTeam();
  const { addToast } = useAuth();

  const [form, setForm] = useState<MemberFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: keyof MemberFormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = memberSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ''])));
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsSubmitting(false);

    addMember(result.data);
    addToast('success', `${result.data.name} added to the team`);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Team Member">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="Jane Smith"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@demo.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
          <select value={form.role} onChange={(e) => set('role', e.target.value)} className={selectClass}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Input
          label="Department"
          placeholder="Engineering"
          value={form.department}
          onChange={(e) => set('department', e.target.value)}
          error={errors.department}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add member
          </Button>
        </div>
      </form>
    </Modal>
  );
}
