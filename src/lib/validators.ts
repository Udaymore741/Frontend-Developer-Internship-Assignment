import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').default(''),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  tags: z.array(z.string()).default([]),
});

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'developer', 'designer', 'manager']),
  department: z.string().min(1, 'Department is required'),
  avatar: z.string().default(''),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
