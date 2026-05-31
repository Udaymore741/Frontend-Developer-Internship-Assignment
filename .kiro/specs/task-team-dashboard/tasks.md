# Tasks

## Phase 1 — Foundation

- [ ] 1. Install dependencies
  - Run `npm install zod lucide-react clsx tailwind-merge date-fns`
  - Verify all packages appear in `package.json` dependencies
  - _Requirement: REQ-ARCH-01, design §11_

- [ ] 2. Configure Tailwind dark mode
  - Add `darkMode: 'class'` to Tailwind config (or CSS layer config in `globals.css` for Tailwind v4)
  - Update `globals.css` with CSS variables for light/dark background and foreground
  - _Requirement: REQ-THEME-04_

- [ ] 3. Define all TypeScript types
  - Create `src/types/index.ts`
  - Define: `Theme`, `Role`, `TaskStatus`, `TaskPriority`, `ToastType`
  - Define: `User`, `Task`, `TeamMember`, `TaskFilters`, `ToastMessage`, `DashboardStats`
  - Define: `TaskFormData`, `MemberFormData`
  - _Requirement: REQ-ARCH-02, design §3_

- [ ] 4. Create utility functions
  - Create `src/lib/utils.ts`
  - Implement: `cn()`, `formatDate()`, `timeAgo()`, `truncate()`, `getInitials()`, `generateId()`, `isOverdue()`
  - _Requirement: REQ-ARCH-05, design §8_

- [ ] 5. Create Zod validation schemas
  - Create `src/lib/validators.ts`
  - Implement: `loginSchema`, `forgotPasswordSchema`, `taskSchema`, `memberSchema`
  - Export inferred types: `LoginInput`, `TaskInput`, `MemberInput`
  - _Requirement: REQ-TASK-06, REQ-TEAM-04, design §6_

- [ ] 6. Create mock data files
  - Create `src/data/mockUser.ts` — `MOCK_CREDENTIALS` + `MOCK_USER`
  - Create `src/data/mockTeam.ts` — 8 `TeamMember` objects across all roles and 3 departments
  - Create `src/data/mockTasks.ts` — 20 `Task` objects covering all statuses, priorities, some overdue
  - _Requirement: REQ-ARCH-06, design §7_

- [ ] 7. Build `useLocalStorage` hook
  - Create `src/hooks/useLocalStorage.ts`
  - Generic hook: `useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]`
  - Reads from localStorage on mount, writes on update, handles SSR (window check)
  - _Requirement: REQ-AUTH-14, REQ-THEME-03_

---

## Phase 2 — Context & Providers

- [ ] 8. Build ThemeContext
  - Create `src/context/ThemeContext.tsx`
  - State: `theme: Theme`
  - Action: `toggleTheme()` — flips between `'light'` and `'dark'`, updates `document.documentElement.classList`, persists via `useLocalStorage`
  - Create `src/hooks/useTheme.ts` — throws if used outside provider
  - _Requirement: REQ-THEME-01, REQ-THEME-02, REQ-THEME-03_

- [ ] 9. Build AppContext (Auth + Toasts)
  - Create `src/context/AppContext.tsx`
  - State: `user`, `isAuthenticated`, `isLoading`, `toasts[]`
  - Actions: `login()`, `logout()`, `addToast()`, `removeToast()`
  - `login()`: 800 ms simulated delay, validate against `MOCK_CREDENTIALS`, set `auth-user` in localStorage + `auth-session=1` cookie on success, throw on failure
  - `logout()`: clear localStorage key + cookie, reset state
  - On mount: rehydrate `user` from localStorage
  - Create `src/hooks/useAuth.ts`
  - _Requirement: REQ-AUTH-06, REQ-AUTH-07, REQ-AUTH-14, REQ-AUTH-16_

- [ ] 10. Build TaskContext
  - Create `src/context/TaskContext.tsx`
  - State: `tasks[]` (seeded from `mockTasks`), `filters: TaskFilters`, `isLoading`
  - Derived: `filteredTasks` via `useMemo` — filters by status, priority, assigneeId, search (case-insensitive title + description match)
  - Actions: `addTask()`, `updateTask()`, `deleteTask()`, `setFilters()`, `clearFilters()`
  - `addTask()` generates id via `generateId()` and sets `createdAt` to `new Date().toISOString()`
  - Create `src/hooks/useTasks.ts`
  - _Requirement: REQ-TASK-01, REQ-TASK-12, REQ-TASK-16, REQ-TASK-17, REQ-ARCH-04_

- [ ] 11. Build TeamContext
  - Create `src/context/TeamContext.tsx`
  - State: `members[]` (seeded from `mockTeam`), `isLoading`
  - Actions: `addMember()`, `removeMember()`
  - `addMember()` generates id and sets `joinedAt`
  - Create `src/hooks/useTeam.ts`
  - _Requirement: REQ-TEAM-01, REQ-TEAM-03, REQ-TEAM-05_

- [ ] 12. Wire providers into root layout
  - Update `src/app/layout.tsx` to wrap children with `ThemeProvider > AppProvider > TaskProvider > TeamProvider`
  - Apply `theme` class to `<html>` element from `ThemeContext`
  - Mount `Toast` component inside providers so it can access `AppContext`
  - _Requirement: REQ-THEME-04, design §4_

---

## Phase 3 — UI Primitives

- [ ] 13. Build Button component
  - Create `src/components/ui/Button.tsx`
  - Props: `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), `isLoading`, `leftIcon`, all native button attrs
  - `isLoading` renders `Spinner` inline and sets `disabled`
  - Use `cn()` for variant class merging
  - _Requirement: REQ-COMP-01, REQ-COMP-02, REQ-COMP-03_

- [ ] 14. Build Input component
  - Create `src/components/ui/Input.tsx`
  - Props: `label`, `error`, `helperText`, `leftIcon`, `rightIcon`, all native input attrs
  - Error state: red border + red error text below field
  - Auto-link `label` → `input` via `htmlFor`/`id`
  - _Requirement: REQ-COMP-01, REQ-AUTH-03, REQ-AUTH-04_

- [ ] 15. Build Badge component
  - Create `src/components/ui/Badge.tsx`
  - Props: `variant: TaskStatus | TaskPriority`
  - Map each variant to bg + text colour pair per design §9
  - _Requirement: REQ-COMP-01, REQ-TASK-02_

- [ ] 16. Build Avatar component
  - Create `src/components/ui/Avatar.tsx`
  - Props: `src`, `name`, `size` (sm/md/lg)
  - Fallback: coloured circle with `getInitials(name)` when `src` is empty or image errors
  - _Requirement: REQ-COMP-01, REQ-TEAM-02_

- [ ] 17. Build Card component
  - Create `src/components/ui/Card.tsx`
  - Props: `children`, `className`, `padding` (sm/md/lg)
  - Base classes: `bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700`
  - _Requirement: REQ-COMP-01, REQ-COMP-02_

- [ ] 18. Build Spinner component
  - Create `src/components/ui/Spinner.tsx`
  - Props: `size` (sm/md/lg), `className`
  - SVG animated circle with `aria-label="Loading"`
  - _Requirement: REQ-COMP-01, REQ-UX-01_

- [ ] 19. Build Modal component
  - Create `src/components/ui/Modal.tsx`
  - Props: `isOpen`, `onClose`, `title`, `children`, `size` (sm/md/lg)
  - Render via `ReactDOM.createPortal` into `document.body`
  - ESC key listener + backdrop click → `onClose`
  - `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing to title
  - Full-screen on mobile (`sm:` breakpoint switches to centred overlay)
  - _Requirement: REQ-COMP-01, REQ-COMP-03, REQ-RESP-04_

- [ ] 20. Build EmptyState component
  - Create `src/components/ui/EmptyState.tsx`
  - Props: `icon`, `title`, `description`, `action` (label + onClick)
  - _Requirement: REQ-COMP-01, REQ-TASK-15_

- [ ] 21. Build Toast component
  - Create `src/components/ui/Toast.tsx`
  - Reads `toasts[]` from `useAuth()`
  - Fixed stack, top-right, `z-50`
  - Each toast: icon (by type), message, close button
  - Auto-dismiss after 4 s via `useEffect` + `setTimeout` calling `removeToast(id)`
  - _Requirement: REQ-COMP-01, REQ-TASK-08, REQ-TASK-11_

---

## Phase 4 — Auth Pages

- [ ] 22. Create middleware for route protection
  - Create `src/middleware.ts`
  - Protect paths: `/dashboard`, `/tasks`, `/team`
  - Read `auth-session` cookie — if missing, redirect to `/login`
  - If on `/login` and cookie exists, redirect to `/dashboard`
  - _Requirement: REQ-AUTH-15, design §2_

- [ ] 23. Create auth layout
  - Create `src/app/(auth)/layout.tsx`
  - Centred card layout: full-height flex, vertically and horizontally centred
  - Light/dark background from theme
  - _Requirement: REQ-AUTH-01_

- [ ] 24. Build Login page
  - Create `src/app/(auth)/login/page.tsx`
  - Form fields: email (`Input`), password (`Input` with type="password")
  - Submit: validate with `loginSchema.safeParse()`, show field errors inline, call `login()` from `useAuth()`
  - Submit button: `isLoading` state while `login()` is pending
  - On success: router.push('/dashboard')
  - On error: show error toast via `addToast()`
  - "Forgot password?" link to `/forgot-password`
  - _Requirement: REQ-AUTH-01 through REQ-AUTH-09_

- [ ] 25. Build Forgot Password page
  - Create `src/app/(auth)/forgot-password/page.tsx`
  - Form field: email (`Input`)
  - Validate with `forgotPasswordSchema`
  - On submit: show success state ("Check your email for a reset link") — no real email sent
  - "Back to login" link
  - _Requirement: REQ-AUTH-10 through REQ-AUTH-13_

---

## Phase 5 — Dashboard Layout Shell

- [ ] 26. Build Sidebar component
  - Create `src/components/layout/Sidebar.tsx`
  - Props: `isMobileOpen`, `onClose`
  - Nav items: Dashboard (`/dashboard`), Tasks (`/tasks`), Team (`/team`) — each with Lucide icon
  - Active item highlighted using `usePathname()`
  - Bottom: user avatar + name + logout button (calls `logout()` from `useAuth()`)
  - Desktop: fixed left panel (240 px); Mobile: absolute overlay drawer
  - _Requirement: REQ-RESP-02, design §5.2_

- [ ] 27. Build Topbar component
  - Create `src/components/layout/Topbar.tsx`
  - Props: `onMenuToggle`
  - Left: hamburger button (mobile only, calls `onMenuToggle`), page title
  - Right: dark mode toggle button (sun/moon icon from Lucide, calls `toggleTheme()`), user avatar
  - _Requirement: REQ-THEME-02, REQ-RESP-02_

- [ ] 28. Build PageHeader component
  - Create `src/components/layout/PageHeader.tsx`
  - Props: `title`, `description`, `action` (ReactNode slot)
  - _Requirement: design §5.2_

- [ ] 29. Create dashboard layout
  - Create `src/app/(dashboard)/layout.tsx`
  - Manages `isMobileOpen` state locally
  - Renders `Sidebar` + `Topbar` + `<main>` content area
  - Main area: `ml-0 md:ml-60` to account for fixed sidebar on desktop
  - _Requirement: REQ-RESP-01, REQ-RESP-02_

---

## Phase 6 — Dashboard Stats Page

- [ ] 30. Build StatCard component
  - Create `src/components/dashboard/StatCard.tsx`
  - Props: `label`, `value`, `icon`, `colorClass`
  - Wrapped in `Card`, icon in coloured circle, large numeric value, label below
  - _Requirement: REQ-DASH-01, REQ-DASH-02_

- [ ] 31. Build ActivityFeed component
  - Create `src/components/dashboard/ActivityFeed.tsx`
  - Hardcoded mock activity array (5 items) inside the component
  - Each item: `Avatar` + action text + `timeAgo()` relative timestamp
  - _Requirement: REQ-DASH-03_

- [ ] 32. Build Dashboard page
  - Create `src/app/(dashboard)/dashboard/page.tsx`
  - Compute `DashboardStats` from `useTasks()` and `useTeam()`:
    - `totalTasks`: `tasks.length`
    - `completedTasks`: tasks filtered by status `'done'`
    - `inProgressTasks`: tasks filtered by status `'in-progress'`
    - `overdueTasks`: tasks where `isOverdue(dueDate)` and status !== `'done'`
    - `totalMembers`: `members.length`
  - Render `PageHeader` + 2×2 (mobile) / 4-col (desktop) `StatCard` grid + `ActivityFeed`
  - _Requirement: REQ-DASH-01 through REQ-DASH-04_

---

## Phase 7 — Task Management

- [ ] 33. Build TaskCard component
  - Create `src/components/tasks/TaskCard.tsx`
  - Props: `task`, `assignee`, `onEdit`, `onDelete`
  - Show: title, `truncate(description, 80)`, `Badge` for status, `Badge` for priority, `Avatar` for assignee (or "Unassigned"), `formatDate(dueDate)` in red if `isOverdue(dueDate)`
  - Edit icon button → `onEdit(task)`; Delete icon button → `onDelete(task.id)`
  - _Requirement: REQ-TASK-02, REQ-TASK-07, REQ-TASK-09_

- [ ] 34. Build TaskSearchBar component
  - Create `src/components/tasks/TaskSearchBar.tsx`
  - Local `inputValue` state, debounced 300 ms → calls `setFilters({ search: value })` from `useTasks()`
  - Clears debounce timer on unmount
  - Lucide `Search` icon on left
  - _Requirement: REQ-TASK-12, REQ-TASK-13, REQ-TASK-14_

- [ ] 35. Build TaskFilters component
  - Create `src/components/tasks/TaskFilters.tsx`
  - Three `<select>` elements: Status, Priority, Assignee (populated from `useTeam()`)
  - Each onChange calls `setFilters()` from `useTasks()`
  - "Clear filters" button calls `clearFilters()`
  - _Requirement: REQ-TASK-16, REQ-TASK-17, REQ-TASK-18, REQ-TASK-19_

- [ ] 36. Build TaskFormModal component
  - Create `src/components/tasks/TaskFormModal.tsx`
  - Props: `isOpen`, `onClose`, `task?` (edit mode if defined)
  - Fields: title (`Input`), description (`Input` textarea), status (`select`), priority (`select`), assignee (`select` from `useTeam()`), dueDate (`Input` type="date")
  - Validate with `taskSchema.safeParse()` on submit, show field errors
  - Create mode: calls `addTask()` + `addToast('success', 'Task created')`
  - Edit mode: calls `updateTask()` + `addToast('success', 'Task updated')`
  - Resets form state on close
  - _Requirement: REQ-TASK-04, REQ-TASK-05, REQ-TASK-06, REQ-TASK-07, REQ-TASK-08_

- [ ] 37. Build TaskList component
  - Create `src/components/tasks/TaskList.tsx`
  - Reads `filteredTasks` and `isLoading` from `useTasks()`
  - Reads `members` from `useTeam()` to resolve assignee per task
  - Shows `Spinner` when loading
  - Shows `EmptyState` (with search/filter context message) when array is empty
  - Renders `TaskCard` grid (1 col mobile, 2 col tablet, 3 col desktop)
  - _Requirement: REQ-TASK-01, REQ-TASK-03, REQ-TASK-15_

- [ ] 38. Build Tasks page
  - Create `src/app/(dashboard)/tasks/page.tsx`
  - State: `isModalOpen`, `editingTask: Task | undefined`
  - Handlers: `handleEdit(task)` → set editingTask + open modal; `handleDelete(id)` → `deleteTask(id)` + `addToast('success', 'Task deleted')`
  - Render: `PageHeader` (with "New Task" Button) + `TaskSearchBar` + `TaskFilters` + `TaskList` + `TaskFormModal`
  - _Requirement: REQ-TASK-01 through REQ-TASK-19_

---

## Phase 8 — Team Management

- [ ] 39. Build MemberCard component
  - Create `src/components/team/MemberCard.tsx`
  - Props: `member`, `taskStats: { assigned: number; completed: number }`, `onRemove`
  - Show: `Avatar`, name, role `Badge`, department, email, progress bar
  - Progress bar width: `(completed / assigned) * 100`% — handle divide-by-zero (show 0%)
  - Remove button with inline confirm: first click shows "Confirm?" state, second click calls `onRemove`
  - _Requirement: REQ-TEAM-02, REQ-TEAM-05_

- [ ] 40. Build MemberFormModal component
  - Create `src/components/team/MemberFormModal.tsx`
  - Props: `isOpen`, `onClose`
  - Fields: name, email, role (select), department
  - Validate with `memberSchema.safeParse()`
  - On submit: `addMember()` + `addToast('success', 'Member added')` + close
  - _Requirement: REQ-TEAM-03, REQ-TEAM-04, REQ-TEAM-06_

- [ ] 41. Build MemberList component
  - Create `src/components/team/MemberList.tsx`
  - Reads `members` from `useTeam()`, `tasks` from `useTasks()`
  - Computes per-member task stats: `assigned = tasks.filter(t => t.assigneeId === member.id).length`, `completed = tasks.filter(t => t.assigneeId === member.id && t.status === 'done').length`
  - Shows `EmptyState` when no members
  - Renders `MemberCard` grid (1 col mobile, 2 col tablet, 3 col desktop)
  - _Requirement: REQ-TEAM-01, REQ-TEAM-02_

- [ ] 42. Build Team page
  - Create `src/app/(dashboard)/team/page.tsx`
  - State: `isModalOpen`
  - Handler: `handleRemove(id)` → `removeMember(id)` + `addToast('success', 'Member removed')`
  - Render: `PageHeader` (with "Add Member" Button) + `MemberList` + `MemberFormModal`
  - _Requirement: REQ-TEAM-01 through REQ-TEAM-06_

---

## Phase 9 — Polish & Responsive

- [ ] 43. Add loading skeleton states
  - Add skeleton placeholder (animated `bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse` divs) to `TaskList` and `MemberList` while `isLoading` is true
  - _Requirement: REQ-UX-03_

- [ ] 44. Verify responsive layout
  - Test Sidebar drawer on mobile (hamburger → open, backdrop click → close, nav link click → close)
  - Test card grids reflow at `sm` and `md` breakpoints
  - Test Modal full-screen on mobile
  - Fix any overflow or spacing issues
  - _Requirement: REQ-RESP-01 through REQ-RESP-04_

- [ ] 45. Verify dark mode across all pages
  - Toggle theme and visually check every page and component
  - Ensure no hardcoded light-only colours remain
  - _Requirement: REQ-THEME-05_

- [ ] 46. Final type-check and lint
  - Run `npx tsc --noEmit` — zero errors
  - Run `npm run lint` — zero warnings
  - Confirm no `any` types exist in the codebase
  - _Requirement: REQ-ARCH-01, REQ-DEPLOY-02_

- [ ] 47. Update root page redirect
  - Update `src/app/page.tsx` to redirect: if authenticated → `/dashboard`, else → `/login`
  - _Requirement: REQ-AUTH-09, design §2_

- [ ] 48. Verify build and deploy
  - Run `npm run build` — must complete with zero errors
  - Deploy to Vercel, confirm all routes work in production
  - _Requirement: REQ-DEPLOY-01, REQ-DEPLOY-02_
