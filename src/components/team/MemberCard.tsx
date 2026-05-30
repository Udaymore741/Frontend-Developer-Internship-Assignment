'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { TeamMember } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface MemberCardProps {
  member: TeamMember;
  taskStats: { assigned: number; completed: number };
  onRemove: (id: string) => void;
}

export function MemberCard({ member, taskStats, onRemove }: MemberCardProps) {
  const [confirming, setConfirming] = useState(false);
  const pct = taskStats.assigned > 0
    ? Math.round((taskStats.completed / taskStats.assigned) * 100)
    : 0;

  return (
    <Card className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} size="lg" />
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{member.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p>
          </div>
        </div>

        {/* Delete with confirm */}
        {confirming ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onRemove(member.id)}
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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0"
            aria-label={`Remove ${member.name}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Role + Department */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={member.role} />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{member.department}</span>
      </div>

      {/* Task progress */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
          <span>Task completion</span>
          <span>{taskStats.completed}/{taskStats.assigned} ({pct}%)</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
