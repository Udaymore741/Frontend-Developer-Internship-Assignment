'use client';

import { Users } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import { useTasks } from '@/context/TaskContext';
import { MemberCard } from './MemberCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface MemberListProps {
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function MemberList({ onRemove, onAdd }: MemberListProps) {
  const { members, isLoading } = useTeam();
  const { tasks } = useTasks();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users size={48} />}
        title="No team members yet"
        description="Add your first team member to get started."
        action={{ label: 'Add member', onClick: onAdd }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {members.map((member) => {
        const assigned = tasks.filter((t) => t.assigneeId === member.id).length;
        const completed = tasks.filter(
          (t) => t.assigneeId === member.id && t.status === 'done',
        ).length;
        return (
          <MemberCard
            key={member.id}
            member={member}
            taskStats={{ assigned, completed }}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}
