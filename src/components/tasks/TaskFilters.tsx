'use client';

import { useTasks } from '@/context/TaskContext';
import { useTeam } from '@/context/TeamContext';
import { cn } from '@/lib/utils';

const selectClass = cn(
  'h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm',
  'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
  'transition-colors cursor-pointer',
);

export function TaskFilters() {
  const { filters, setFilters, clearFilters } = useTasks();
  const { members } = useTeam();

  const hasActiveFilters =
    filters.status !== 'all' || filters.priority !== 'all' || filters.assigneeId !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}
        className={selectClass}
        aria-label="Filter by priority"
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      {/* Assignee */}
      <select
        value={filters.assigneeId}
        onChange={(e) => setFilters({ assigneeId: e.target.value })}
        className={selectClass}
        aria-label="Filter by assignee"
      >
        <option value="all">All Assignees</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="h-10 px-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
