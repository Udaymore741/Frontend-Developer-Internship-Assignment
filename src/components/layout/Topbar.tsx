'use client';

import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 gap-3">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* User avatar */}
      {user && <Avatar name={user.name} size="sm" />}
    </header>
  );
}
