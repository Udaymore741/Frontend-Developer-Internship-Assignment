# Design Document

## Overview

The Task & Team Management Dashboard is a client-side Next.js 16 App Router application. It uses React Context API for all global state, Tailwind CSS v4 for styling with a `dark` class strategy, and Zod for form validation. There is no backend — all data lives in mock TypeScript files and in-memory context state.

This document covers: folder structure, routing architecture, TypeScript type system, component hierarchy, context/state design, data flow, and key implementation patterns.

---

## 1. Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                  # Centred card layout, no sidebar
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + Topbar shell
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── team/
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx                      # Root: fonts, ThemeProvider, AppProvider, TaskProvider, TeamProvider
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── ActivityFeed.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskSearchBar.tsx
│   │   └── TaskFormModal.tsx
│   └── team/
│       ├── MemberCard.tsx
│       ├── MemberList.tsx
│       └── MemberFormModal.tsx
│
├── context/
│   ├── ThemeContext.tsx
│   ├── AppContext.tsx
│   ├── TaskContext.tsx
│   └── TeamContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useTeam.ts
│   ├── useTheme.ts
│   └── useLocalStorage.ts
│
├── lib/
│   ├── utils.ts                        # cn(), formatDate(), truncate(), getInitials()
│   └── validators.ts                   # Zod schemas
│
├── data/
│   ├── mockUser.ts
│   ├── mockTasks.ts
│   └── mockTeam.ts
│
├── types/
│   └── index.ts
│
└── middleware.ts                       # Route protection
```

---

## 2. Routing Architecture

```
/                     → redirects to /dashboard (if authed) or /login
/login                → (auth) layout
/forgot-password      → (auth) layout
/dashboard            → (dashboard) layout  [protected]
/tasks                → (dashboard) layout  [protected]
/team                 → (dashboard) layout  [protected]
```

Route groups keep auth pages and dashboard pages in separate layout trees without affecting URLs. `middleware.ts` intercepts all `/(dashboard)/*` requests and redirects unauthenticated users to `/login`.

### middleware.ts logic
```
request comes in
  → if path starts with /dashboard, /tasks, /team
      → read 'auth-session' from cookies or check localStorage via a cookie set on login
      → if no session → redirect to /login
  → if path is /login and session exists → redirect to /dashboard
```

> Note: Since localStorage is not accessible in middleware (edge runtime), login will also set a lightweight `auth-session` cookie (no sensitive data, just a boolean flag) that middleware can read.

---

## 3. TypeScript Type System

All types live in `src/types/index.ts`.

```ts
// Primitive union types
export type Theme = 'light' | 'dark';
export type Role = 'admin' | 'developer' | 'designer' | 'manager';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Domain models
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;       // URL or empty string (triggers initials fallback)
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;   // references TeamMember.id
  createdAt: string;    // ISO 8601
  dueDate: string;      // ISO 8601
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  joinedAt: string;     // ISO 8601
}

// UI / state shapes
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

// Form input shapes (separate from domain models — no id/createdAt)
export type TaskFormData = Omit<Task, 'id' | 'createdAt'>;
export type MemberFormData = Omit<TeamMember, 'id' | 'joinedAt'>;
```

---

## 4. Context & State Design

### 4.1 ThemeContext

```ts
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

- Reads initial value from `localStorage` (via `useLocalStorage` hook), falls back to `'light'`.
- On change, writes to `localStorage` and toggles `dark` class on `document.documentElement`.
- Provider wraps the entire app in root `layout.tsx`.

### 4.2 AppContext (Auth)

```ts
interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  toasts: ToastMessage[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}
```

- On mount, reads `auth-user` from `localStorage` to rehydrate state.
- `login()` simulates a 800 ms async delay, validates against `mockUser.ts`, sets cookie + localStorage on success.
- `logout()` clears cookie + localStorage, resets state.
- Toasts are managed here so any component can trigger them via `useAuth()`.

### 4.3 TaskContext

```ts
interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  filteredTasks: Task[];   // derived — computed with useMemo
  isLoading: boolean;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
}
```

- `filteredTasks` is a `useMemo` derived value — never stored in state.
- Filter logic: `tasks.filter(t => matchesStatus && matchesPriority && matchesAssignee && matchesSearch)`.
- Search matches against `title` and `description` (case-insensitive).
- Initial state seeded from `mockTasks.ts`.

### 4.4 TeamContext

```ts
interface TeamContextType {
  members: TeamMember[];
  isLoading: boolean;
  addMember: (data: MemberFormData) => void;
  removeMember: (id: string) => void;
}
```

- Initial state seeded from `mockTeam.ts`.

### Context Provider Tree (root layout.tsx)

```tsx
<ThemeProvider>
  <AppProvider>
    <TaskProvider>
      <TeamProvider>
        {children}
        <Toast />   {/* reads toasts from AppContext */}
      </TeamProvider>
    </TaskProvider>
  </AppProvider>
</ThemeProvider>
```

### Custom Hook Pattern (same for all contexts)

```ts
// hooks/useAuth.ts
export const useAuth = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within AppProvider');
  return ctx;
};
```

---

## 5. Component Design

### 5.1 UI Primitives

#### Button
```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}
```
- `isLoading` renders a `Spinner` and disables the button.
- Variants map to Tailwind class sets via `cn()`.

#### Input
```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```
- Error state adds red border + red error text below.
- `id` auto-generated from `label` if not provided (for `htmlFor` linkage).

#### Badge
```ts
interface BadgeProps {
  variant: TaskStatus | TaskPriority;
  className?: string;
}
```
- Maps each status/priority to a colour: `todo`→slate, `in-progress`→blue, `review`→yellow, `done`→green, `low`→slate, `medium`→yellow, `high`→orange, `critical`→red.

#### Avatar
```ts
interface AvatarProps {
  src?: string;
  name: string;           // used for initials fallback
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```
- If `src` is empty or errors, renders a coloured circle with initials from `getInitials(name)`.

#### Modal
```ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```
- Rendered via `ReactDOM.createPortal` into `document.body`.
- ESC key closes it; backdrop click closes it.
- Focus is trapped inside while open (`aria-modal="true"`).
- Full-screen on mobile, centred overlay on desktop.

#### Toast
```ts
// Reads toasts[] from AppContext, renders a fixed stack top-right
// Each toast auto-dismisses after 4 seconds via useEffect + setTimeout
```

#### Spinner
```ts
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
// SVG animated circle, aria-label="Loading"
```

#### EmptyState
```ts
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

#### Card
```ts
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}
// Wrapper: bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700
```

---

### 5.2 Layout Components

#### Sidebar
- Fixed left panel on desktop (240 px wide).
- Drawer overlay on mobile (triggered by hamburger in Topbar).
- Nav items: Dashboard, Tasks, Team — each with a Lucide icon and active highlight.
- Bottom section: logged-in user avatar + name + logout button.
- State: `isMobileOpen` managed locally with `useState`.

#### Topbar
- Sticky top bar across all dashboard pages.
- Left: hamburger button (mobile only) + current page title.
- Right: dark mode toggle (sun/moon icon), user avatar.
- Receives `onMenuToggle` prop from dashboard layout to open Sidebar drawer.

#### PageHeader
```ts
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;   // e.g. "New Task" button
}
```

---

### 5.3 Dashboard Components

#### StatCard
```ts
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;   // e.g. 'text-blue-500'
}
```
- Grid: 2 columns on mobile, 4 on desktop.

#### ActivityFeed
- Renders last 5 task updates from mock activity data.
- Each item: avatar + action text + relative time (e.g. "2 hours ago" via `date-fns`).

---

### 5.4 Task Components

#### TaskCard
```ts
interface TaskCardProps {
  task: Task;
  assignee: TeamMember | undefined;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```
- Shows: title, truncated description, `Badge` for status, `Badge` for priority, `Avatar` for assignee, formatted due date.
- Due date turns red if past today.
- Three-dot menu (or two icon buttons) for edit/delete actions.

#### TaskList
- Receives `filteredTasks` from `useTasks()`.
- Renders `TaskCard` for each task.
- Shows `EmptyState` when array is empty.
- Shows `Spinner` when `isLoading` is true.

#### TaskFilters
- Three `<select>` elements: Status, Priority, Assignee.
- Wired to `setFilters()` from `useTasks()`.
- "Clear" button calls `clearFilters()`.

#### TaskSearchBar
- Controlled input with local state.
- `useEffect` + `setTimeout` debounce (300 ms) calls `setFilters({ search: value })`.
- Clears debounce timer on unmount.

#### TaskFormModal
```ts
interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;   // undefined = create mode, defined = edit mode
}
```
- Uses Zod schema for validation (see §6).
- On submit: calls `addTask()` or `updateTask()` from `useTasks()`, then calls `addToast()` from `useAuth()`, then closes modal.

---

### 5.5 Team Components

#### MemberCard
```ts
interface MemberCardProps {
  member: TeamMember;
  taskStats: { assigned: number; completed: number };
  onRemove: (id: string) => void;
}
```
- Progress bar: `completed / assigned` as a percentage width.
- Remove button triggers confirmation via a small inline confirm state (no separate modal needed).

#### MemberList
- Renders `MemberCard` grid.
- Shows `EmptyState` when no members.

#### MemberFormModal
- Fields: name, email, role (select), department.
- Validated with Zod.
- On submit: calls `addMember()`, shows toast, closes.

---

## 6. Zod Validation Schemas

```ts
// lib/validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
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
export type TaskInput = z.infer<typeof taskSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
```

Form validation pattern in components:
```ts
const result = taskSchema.safeParse(formData);
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors;
  setErrors(fieldErrors);
  return;
}
// proceed with result.data
```

---

## 7. Mock Data Design

### mockUser.ts
```ts
export const MOCK_CREDENTIALS = { email: 'alex@demo.com', password: 'password123' };
export const MOCK_USER: User = {
  id: 'u0', name: 'Alex Johnson', email: 'alex@demo.com',
  avatar: '', role: 'admin',
};
```

### mockTeam.ts
8 members covering all roles, 2–3 departments (Engineering, Design, Product).

### mockTasks.ts
20 tasks covering:
- All 4 statuses (5 tasks each)
- All 4 priorities
- Mix of assignees
- Some with past due dates (to show overdue state)
- Some with future due dates

---

## 8. Utility Functions

```ts
// lib/utils.ts

// Merge Tailwind classes safely
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Format ISO date string → "Jan 15, 2025"
export const formatDate = (iso: string) => format(new Date(iso), 'MMM d, yyyy');

// Relative time → "2 hours ago"
export const timeAgo = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });

// Truncate text
export const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + '…' : text;

// Get initials from full name
export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

// Generate a simple unique ID
export const generateId = () => Math.random().toString(36).slice(2, 9);

// Check if a date is overdue
export const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();
```

---

## 9. Styling System

### Tailwind Configuration
- `darkMode: 'class'` — toggled by adding/removing `dark` on `<html>`.
- Custom CSS variables in `globals.css` for background and foreground colours.
- No custom theme extensions needed — Tailwind's default palette is sufficient.

### Colour Conventions
| Element | Light | Dark |
|---|---|---|
| Page background | `bg-zinc-50` | `dark:bg-zinc-900` |
| Card background | `bg-white` | `dark:bg-zinc-800` |
| Border | `border-zinc-200` | `dark:border-zinc-700` |
| Primary text | `text-zinc-900` | `dark:text-zinc-50` |
| Secondary text | `text-zinc-500` | `dark:text-zinc-400` |
| Primary action | `bg-indigo-600 hover:bg-indigo-700` | same |
| Sidebar | `bg-white border-r` | `dark:bg-zinc-800 dark:border-zinc-700` |

### Status / Priority Badge Colours
| Value | Background | Text |
|---|---|---|
| todo | `bg-zinc-100` | `text-zinc-600` |
| in-progress | `bg-blue-100` | `text-blue-700` |
| review | `bg-yellow-100` | `text-yellow-700` |
| done | `bg-green-100` | `text-green-700` |
| low | `bg-zinc-100` | `text-zinc-600` |
| medium | `bg-yellow-100` | `text-yellow-700` |
| high | `bg-orange-100` | `text-orange-700` |
| critical | `bg-red-100` | `text-red-700` |

---

## 10. Data Flow Diagram

```
Root layout.tsx
  └── ThemeProvider
        └── AppProvider  (user, toasts, login, logout)
              └── TaskProvider  (tasks, filters, filteredTasks, CRUD)
                    └── TeamProvider  (members, CRUD)
                          ├── (auth)/layout.tsx
                          │     ├── /login  → useAuth() for login()
                          │     └── /forgot-password
                          └── (dashboard)/layout.tsx
                                ├── Sidebar  → useAuth() for user + logout()
                                ├── Topbar   → useTheme() for toggle
                                ├── /dashboard  → useTasks() + useTeam() for stats
                                ├── /tasks      → useTasks() for list + CRUD
                                │               → useTeam() for assignee select
                                └── /team       → useTeam() for list + CRUD
                                                → useTasks() for task stats per member
```

---

## 11. Key Implementation Notes

1. **No `any` types** — every function parameter, return value, and state variable is explicitly typed.

2. **`filteredTasks` is derived, never stored** — computed with `useMemo` inside `TaskContext`, depends on `[tasks, filters]`. This avoids stale state bugs.

3. **Debounced search** — `TaskSearchBar` holds local input state, debounces 300 ms before calling `setFilters`. The context never sees intermediate keystrokes.

4. **Cookie + localStorage dual strategy for auth** — `localStorage` for client-side rehydration on mount; a `auth-session=1` cookie (no sensitive data) for `middleware.ts` to read at the edge.

5. **Optimistic updates** — task CRUD updates context state immediately (no async delay) since there's no real API. The simulated delay on login is the only intentional async operation.

6. **Modal accessibility** — focus moves to modal on open, returns to trigger element on close, ESC closes it, backdrop click closes it, `aria-modal="true"` and `role="dialog"` set.

7. **Packages to install**:
   ```bash
   npm install zod lucide-react clsx tailwind-merge date-fns
   ```
