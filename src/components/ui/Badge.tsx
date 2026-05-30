import { cn } from '@/lib/utils';
import type { TaskStatus, TaskPriority, Role } from '@/types';

type BadgeVariant = TaskStatus | TaskPriority | Role;

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  // Status
  todo: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  // Priority
  low: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  // Role
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  developer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  designer: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  manager: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

const labelMap: Record<BadgeVariant, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
  admin: 'Admin',
  developer: 'Developer',
  designer: 'Designer',
  manager: 'Manager',
};

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {labelMap[variant]}
    </span>
  );
}
