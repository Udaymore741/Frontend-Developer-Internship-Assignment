'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

export function TaskSearchBar() {
  const { filters, setFilters } = useTasks();
  const [value, setValue] = useState(filters.search);

  // Debounce: wait 300 ms after last keystroke before updating context
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: value });
    }, 300);
    return () => clearTimeout(timer);
  }, [value, setFilters]);

  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute left-3 text-zinc-400 pointer-events-none" />
      <input
        type="search"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'w-full h-10 pl-9 pr-9 rounded-lg border border-zinc-300 dark:border-zinc-600',
          'bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50',
          'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'transition-colors',
        )}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
