'use client';

import { useState } from 'react';
import { Pencil, Trash2, Calendar, User } from 'lucide-react';
import type { Task, TeamMember } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { formatDate, truncate, isOverdue, cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  assignee: TeamMember | undefined;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, assignee, onEdit, onDelete }: TaskCardProps) {
  const [confirming, setConfirming] = useState(false);
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            aria-label="Edit task"
          >
            <Pencil size={14} />
          </button>

          {/* Delete with inline confirm */}
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {truncate(task.description, 80)}
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={task.status} />
        <Badge variant={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-700">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {assignee ? (
            <>
              <Avatar name={assignee.name} size="sm" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{assignee.name}</span>
            </>
          ) : (
            <>
              <User size={14} className="text-zinc-300" />
              <span className="text-xs text-zinc-400">Unassigned</span>
            </>
          )}
        </div>

        {/* Due date */}
        <div className={cn('flex items-center gap-1', overdue ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500')}>
          <Calendar size={12} />
          <span className="text-xs">{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </Card>
  );
}
