import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/** Merge Tailwind classes safely, resolving conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Format ISO date string → "Jan 15, 2025" */
export const formatDate = (iso: string): string => {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
};

/** Relative time → "2 hours ago" */
export const timeAgo = (iso: string): string => {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
};

/** Truncate text to max characters, appending ellipsis. */
export const truncate = (text: string, max: number): string =>
  text.length > max ? text.slice(0, max) + '…' : text;

/** Get up to 2 initials from a full name. */
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Generate a short random ID. */
export const generateId = (): string => Math.random().toString(36).slice(2, 9);

/** Returns true if the given ISO date is in the past. */
export const isOverdue = (dueDate: string): boolean =>
  new Date(dueDate) < new Date();
