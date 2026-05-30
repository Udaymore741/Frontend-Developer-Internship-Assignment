'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import type { Task, TaskFilters, TaskFormData } from '@/types';
import { mockTasks } from '@/data/mockTasks';
import { generateId, isOverdue } from '@/lib/utils';

interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  filteredTasks: Task[];
  isLoading: boolean;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
}

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  search: '',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [isLoading] = useState(false);

  // Derived — never stored in state
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filters.status !== 'all' && t.status !== filters.status) return false;
        if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
        if (filters.assigneeId !== 'all' && t.assigneeId !== filters.assigneeId) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (
            !t.title.toLowerCase().includes(q) &&
            !t.description.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [tasks, filters]);

  const addTask = useCallback((data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback(
    (id: string, data: Partial<TaskFormData>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setFilters = useCallback((partial: Partial<TaskFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filters,
        filteredTasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        setFilters,
        clearFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}

// Re-export isOverdue so pages can use it without importing from utils directly
export { isOverdue };
