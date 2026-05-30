# Requirements Document

## Introduction

This document defines the requirements for a **Task & Team Management Dashboard** — a frontend-only single-page application built as a Frontend Developer Internship Assignment. The application demonstrates professional-grade React/Next.js architecture using the App Router, TypeScript, Tailwind CSS v4, Context API for global state, Zod for form validation, and a dark-mode-capable design system. All data is mock/in-memory; there is no backend or persistent storage.

The application covers five functional areas: authentication (login + forgot-password), a statistics dashboard, task management (CRUD, search, filter), team member management, and a global theme toggle. The codebase is structured for maintainability, scalability, and interview-quality review.

---

## Glossary

- **App**: The Next.js 16 App Router application as a whole.
- **AuthContext**: The React Context that manages authentication state and the current user session.
- **TaskContext**: The React Context that manages the tasks list, filters, and search state.
- **TeamContext**: The React Context that manages the team members list.
- **ThemeContext**: The React Context that manages the dark/light mode preference.
- **Mock data**: Static TypeScript files that simulate a backend data source.
- **Protected route**: A route that requires the user to be authenticated; unauthenticated users are redirected to `/login`.
- **Spec**: This Kiro spec document set (requirements → design → tasks).

---

## Requirements

### 1. Authentication

#### 1.1 Login Page
- **REQ-AUTH-01**: The app shall provide a `/login` page accessible to unauthenticated users.
- **REQ-AUTH-02**: The login form shall include an email field and a password field.
- **REQ-AUTH-03**: On submit, the form shall validate that both fields are non-empty and that the email matches a valid email format.
- **REQ-AUTH-04**: Validation errors shall be displayed inline beneath the relevant field.
- **REQ-AUTH-05**: The form shall display a loading spinner on the submit button while the mock authentication is processing.
- **REQ-AUTH-06**: On successful login, the user shall be redirected to `/dashboard`.
- **REQ-AUTH-07**: On failed login (wrong credentials), an error toast or inline message shall be shown.
- **REQ-AUTH-08**: The login page shall include a "Forgot password?" link navigating to `/forgot-password`.
- **REQ-AUTH-09**: Authenticated users visiting `/login` shall be redirected to `/dashboard`.

#### 1.2 Forgot Password Page
- **REQ-AUTH-10**: The app shall provide a `/forgot-password` page.
- **REQ-AUTH-11**: The page shall include an email input field with validation (non-empty, valid format).
- **REQ-AUTH-12**: On submit, the page shall display a success state ("Check your email") without any real email being sent.
- **REQ-AUTH-13**: The page shall include a "Back to login" link.

#### 1.3 Session & Route Protection
- **REQ-AUTH-14**: Authentication state shall be persisted in `localStorage` so a page refresh does not log the user out.
- **REQ-AUTH-15**: All routes under `/(dashboard)` shall be protected; unauthenticated access redirects to `/login` via Next.js `middleware.ts`.
- **REQ-AUTH-16**: A logout action shall clear the session from `localStorage` and redirect to `/login`.

---

### 2. Dashboard Statistics Page

- **REQ-DASH-01**: The `/dashboard` page shall display a grid of statistic cards summarising: Total Tasks, Completed Tasks, In-Progress Tasks, Overdue Tasks, and Total Team Members.
- **REQ-DASH-02**: Each stat card shall show an icon, a label, and a numeric value.
- **REQ-DASH-03**: The dashboard shall display a recent activity feed showing the last 5 task updates (mock data).
- **REQ-DASH-04**: Stats shall be derived from the live task and team context state, not hardcoded.

---

### 3. Task Management

#### 3.1 Task List
- **REQ-TASK-01**: The `/tasks` page shall display all tasks in a list or card grid layout.
- **REQ-TASK-02**: Each task card shall show: title, description (truncated), status badge, priority badge, assignee avatar, and due date.
- **REQ-TASK-03**: Tasks shall be sorted by creation date descending by default.

#### 3.2 Create & Edit Tasks
- **REQ-TASK-04**: A "New Task" button shall open a modal form for creating a task.
- **REQ-TASK-05**: The task form shall include: title (required), description (optional), status (select), priority (select), assignee (select from team members), and due date (date input).
- **REQ-TASK-06**: All required fields shall be validated with Zod before submission.
- **REQ-TASK-07**: Each task card shall have an edit action that opens the same modal pre-populated with the task's current values.
- **REQ-TASK-08**: On successful create or edit, a success toast notification shall appear.

#### 3.3 Delete Tasks
- **REQ-TASK-09**: Each task card shall have a delete action.
- **REQ-TASK-10**: Deletion shall require a confirmation step (confirm dialog or modal).
- **REQ-TASK-11**: On successful deletion, a success toast shall appear.

#### 3.4 Search
- **REQ-TASK-12**: A search bar shall be present on the tasks page.
- **REQ-TASK-13**: Search shall filter tasks by title and description in real time.
- **REQ-TASK-14**: The search input shall be debounced (300 ms) to avoid excessive re-renders.
- **REQ-TASK-15**: When no tasks match the search query, an empty state component shall be displayed.

#### 3.5 Filters
- **REQ-TASK-16**: Filter controls shall allow filtering by: Status (all / todo / in-progress / review / done) and Priority (all / low / medium / high / critical).
- **REQ-TASK-17**: Filters shall be combinable (status AND priority AND search all apply simultaneously).
- **REQ-TASK-18**: An "assignee" filter shall allow filtering tasks by team member.
- **REQ-TASK-19**: A "Clear filters" action shall reset all filters and search to their default state.

---

### 4. Team Members

- **REQ-TEAM-01**: The `/team` page shall display all team members in a card grid.
- **REQ-TEAM-02**: Each member card shall show: avatar (with initials fallback), name, role, department, and a task completion progress bar (completed / assigned).
- **REQ-TEAM-03**: An "Add Member" button shall open a modal form with fields: name, email, role (select), and department.
- **REQ-TEAM-04**: The add member form shall be validated with Zod.
- **REQ-TEAM-05**: Each member card shall have a remove action with a confirmation step.
- **REQ-TEAM-06**: On add or remove, a toast notification shall appear.

---

### 5. Dark Mode

- **REQ-THEME-01**: The app shall support light and dark themes.
- **REQ-THEME-02**: The theme shall be toggled via a button in the top navigation bar.
- **REQ-THEME-03**: The selected theme shall be persisted in `localStorage` and restored on page load.
- **REQ-THEME-04**: The theme shall be applied via the `dark` class on the `<html>` element (Tailwind CSS `darkMode: 'class'` strategy).
- **REQ-THEME-05**: All pages and components shall have appropriate `dark:` Tailwind variants.

---

### 6. Responsive Design

- **REQ-RESP-01**: The layout shall be fully usable on mobile (≥ 320 px), tablet (≥ 768 px), and desktop (≥ 1024 px) viewports.
- **REQ-RESP-02**: The sidebar shall collapse into a hamburger-triggered drawer on mobile.
- **REQ-RESP-03**: Stat card grids and team/task card grids shall reflow from multi-column to single-column on small screens.
- **REQ-RESP-04**: Modal dialogs shall be full-screen on mobile and centred overlays on desktop.

---

### 7. Loading & Error States

- **REQ-UX-01**: Any simulated async operation (login, task CRUD, team CRUD) shall show a loading spinner or disabled button state during processing.
- **REQ-UX-02**: If an operation fails (simulated error), an error toast or inline error message shall be displayed.
- **REQ-UX-03**: Pages that depend on context data shall show a skeleton or spinner while data is initialising.

---

### 8. Reusable Component System

- **REQ-COMP-01**: The following primitive UI components shall be built and reused across the app: `Button`, `Input`, `Badge`, `Avatar`, `Card`, `Modal`, `Spinner`, `EmptyState`, `Toast`.
- **REQ-COMP-02**: Each component shall accept a `className` prop for style extension.
- **REQ-COMP-03**: Interactive components (`Button`, `Input`, `Modal`) shall meet basic accessibility requirements: correct ARIA attributes, keyboard operability, and visible focus indicators.

---

### 9. Code Quality & Architecture

- **REQ-ARCH-01**: No TypeScript `any` types shall be used anywhere in the codebase.
- **REQ-ARCH-02**: All shared types and interfaces shall be defined in `src/types/index.ts`.
- **REQ-ARCH-03**: Business logic shall not live inside page components; pages shall only compose feature components.
- **REQ-ARCH-04**: Each Context shall expose a custom hook (e.g. `useAuth`, `useTasks`) that throws a descriptive error if used outside its provider.
- **REQ-ARCH-05**: Utility functions (`cn`, `formatDate`, etc.) shall live in `src/lib/utils.ts`.
- **REQ-ARCH-06**: Mock data shall live in `src/data/` and be typed against the interfaces in `src/types/index.ts`.

---

### 10. Deployment

- **REQ-DEPLOY-01**: The application shall be deployable to Vercel with zero configuration changes.
- **REQ-DEPLOY-02**: The `next build` command shall complete without errors or type-check failures.
