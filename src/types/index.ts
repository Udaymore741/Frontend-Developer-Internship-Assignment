// ─── Primitive union types ────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
export type Role = 'admin' | 'developer' | 'designer' | 'manager';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// ─── Domain models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  createdAt: string; // ISO 8601
  dueDate: string;   // ISO 8601
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  joinedAt: string; // ISO 8601
}

// ─── UI / state shapes ────────────────────────────────────────────────────────

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assigneeId: string | 'all';
  search: string;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalMembers: number;
}

// ─── Form input shapes (no id / createdAt / joinedAt) ────────────────────────

export type TaskFormData = Omit<Task, 'id' | 'createdAt'>;
export type MemberFormData = Omit<TeamMember, 'id' | 'joinedAt'>;
