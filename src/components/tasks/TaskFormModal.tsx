'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/context/TaskContext';
import { useTeam } from '@/context/TeamContext';
import { useAuth } from '@/context/AppContext';
import { taskSchema } from '@/lib/validators';
import type { Task, TaskFormData } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

const selectClass = cn(
  'w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm',
  'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
);

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: '',
  dueDate: '',
  tags: [],
};

export function TaskFormModal({ isOpen, onClose, task }: TaskFormModalProps) {
  const { addTask, updateTask } = useTasks();
  const { members } = useTeam();
  const { addToast } = useAuth();

  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate.split('T')[0], // date input needs YYYY-MM-DD
        tags: task.tags,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [task, isOpen]);

  const set = (field: keyof TaskFormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ''])));
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsSubmitting(false);

    if (task) {
      updateTask(task.id, result.data);
      addToast('success', 'Task updated');
    } else {
      addTask(result.data);
      addToast('success', 'Task created');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            placeholder="Optional description…"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm resize-none',
              'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
              errors.description
                ? 'border-red-400 dark:border-red-500'
                : 'border-zinc-300 dark:border-zinc-600',
            )}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={selectClass}>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
            <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className={selectClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assignee</label>
          <select
            value={form.assigneeId}
            onChange={(e) => set('assigneeId', e.target.value)}
            className={cn(selectClass, errors.assigneeId && 'border-red-400 dark:border-red-500')}
          >
            <option value="">Select assignee…</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          {errors.assigneeId && <p className="text-xs text-red-500">{errors.assigneeId}</p>}
        </div>

        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
          error={errors.dueDate}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {task ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
