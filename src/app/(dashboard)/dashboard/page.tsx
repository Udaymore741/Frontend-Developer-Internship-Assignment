'use client';

import { CheckCircle, Clock, AlertCircle, ListTodo, Users } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { useTeam } from '@/context/TeamContext';
import { isOverdue } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { PageHeader } from '@/components/layout/PageHeader';

export default function DashboardPage() {
  const { tasks } = useTasks();
  const { members } = useTeam();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'done').length,
    inProgressTasks: tasks.filter((t) => t.status !== 'done').length,
    overdueTasks: tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length,
    totalMembers: members.length,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your team's progress"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="animate-slide-up stagger-1">
          <StatCard
            label="Total Tasks"
            value={stats.totalTasks}
            icon={<ListTodo size={20} className="text-indigo-600" />}
            colorClass="bg-indigo-50 dark:bg-indigo-900/30"
          />
        </div>
        <div className="animate-slide-up stagger-2">
          <StatCard
            label="Completed"
            value={stats.completedTasks}
            icon={<CheckCircle size={20} className="text-green-600" />}
            colorClass="bg-green-50 dark:bg-green-900/30"
          />
        </div>
        <div className="animate-slide-up stagger-3">
          <StatCard
            label="Pending Tasks"
            value={stats.inProgressTasks}
            icon={<Clock size={20} className="text-blue-600" />}
            colorClass="bg-blue-50 dark:bg-blue-900/30"
          />
        </div>
        <div className="animate-slide-up stagger-4">
          <StatCard
            label="Overdue"
            value={stats.overdueTasks}
            icon={<AlertCircle size={20} className="text-red-600" />}
            colorClass="bg-red-50 dark:bg-red-900/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-up stagger-5">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <StatCard
          label="Team Members"
          value={stats.totalMembers}
          icon={<Users size={20} className="text-violet-600" />}
          colorClass="bg-violet-50 dark:bg-violet-900/30"
        />
      </div>
    </div>
  );
}
