# Task & Team Management Dashboard

A modern, responsive dashboard for managing tasks and team members — built as a Frontend Developer Internship Assignment.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** with TypeScript 5
- **Tailwind CSS v4**
- **Zod** for form validation
- **Context API** for global state
- **Lucide React** for icons
- **date-fns** for date formatting

## Features

- **Authentication** — Login and Forgot Password pages with full form validation
- **Dashboard** — Stat cards (Total Tasks, Completed, Pending, Team Members) + activity feed
- **Task Management** — Create, edit, delete, search, and filter tasks by status/priority/assignee
- **Team Members** — View, add, and remove team members with task completion progress
- **Dark Mode** — Toggle between light and dark themes, persisted across sessions
- **Responsive** — Works on mobile, tablet, and desktop
- **Animations** — Page fade-in, card stagger entrance, modal scale-in, toast slide-in

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd task-team-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

```
Email:    alex@demo.com
Password: password123
```

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Forgot Password pages
│   ├── (dashboard)/     # Dashboard, Tasks, Team pages
│   └── layout.tsx       # Root layout with all providers
├── components/
│   ├── ui/              # Reusable primitives (Button, Input, Modal, etc.)
│   ├── layout/          # Sidebar, Topbar, PageHeader
│   ├── dashboard/       # StatCard, ActivityFeed
│   ├── tasks/           # TaskCard, TaskList, TaskFilters, TaskFormModal
│   └── team/            # MemberCard, MemberList, MemberFormModal
├── context/             # ThemeContext, AppContext, TaskContext, TeamContext
├── hooks/               # useLocalStorage
├── lib/                 # utils.ts, validators.ts (Zod schemas)
├── data/                # mockUser, mockTasks, mockTeam
└── types/               # All TypeScript interfaces
```

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com) with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
