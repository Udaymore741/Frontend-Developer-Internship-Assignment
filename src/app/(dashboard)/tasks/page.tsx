'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AppContext';
import type { Task } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { TaskSearchBar } from '@/components/tasks/TaskSearchBar';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';

export default function TasksPage() {
  const { deleteTask } = useTasks();
  const { addToast } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    addToast('success', 'Task deleted');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tasks"
        description="Manage and track all your team's tasks"
        action={
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            New Task
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <TaskSearchBar />
        </div>
        <TaskFilters />
      </div>

      <TaskList onEdit={handleEdit} onDelete={handleDelete} />

      <TaskFormModal isOpen={isModalOpen} onClose={handleClose} task={editingTask} />
    </div>
  );
}
