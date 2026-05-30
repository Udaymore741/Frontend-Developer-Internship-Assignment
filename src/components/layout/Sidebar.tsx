'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Users, LogOut, X } from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/team', label: 'Team', icon: Users },
];

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">TaskBoard</span>
        </div>
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-zinc-200 dark:border-zinc-700 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-2">
          <Avatar name={user?.name ?? 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 z-50 md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
