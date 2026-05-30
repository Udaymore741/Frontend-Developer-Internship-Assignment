'use client';

import { ClipboardList } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { useTeam } from '@/context/TeamContext';
import type { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ onEdit, onDelete }: TaskListProps) {
  const { filteredTasks, isLoading } = useTasks();
  const { members } = useTeam();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList size={48} />}
        title="No tasks found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          assignee={members.find((m) => m.id === task.assigneeId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
