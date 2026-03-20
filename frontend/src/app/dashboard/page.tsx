'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { Navbar } from '@/components/layout/Navbar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { TaskFiltersBar } from '@/components/tasks/TaskFiltersBar';
import { PaginationBar } from '@/components/ui/Pagination';
import { StatsBar } from '@/components/tasks/StatsBar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTask,
} from '@/hooks/useTasks';
import { Task, TaskFilters, CreateTaskData } from '@/types';
import { Plus, ClipboardList } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 9 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth/login');
  }, [user, authLoading, router]);

  const { data, isLoading, isError } = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  const handleFiltersChange = useCallback((f: TaskFilters) => setFilters(f), []);

  const handleSubmit = async (formData: CreateTaskData) => {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, data: formData });
    } else {
      await createTask.mutateAsync(formData);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    await deleteTask.mutateAsync(deletingTask.id);
    setDeletingTask(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {pagination ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''} total` : ''}
            </p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>New task</span>
          </button>
        </div>

        {/* Stats */}
        {data && <StatsBar tasks={tasks} total={pagination?.total ?? 0} />}

        {/* Filters */}
        <TaskFiltersBar filters={filters} onChange={handleFiltersChange} />

        {/* Task grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 h-32 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-slate-500">
            <p>Failed to load tasks. Please try again.</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-2">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-700">No tasks found</h3>
            <p className="text-sm text-slate-400">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button
                onClick={() => { setEditingTask(null); setModalOpen(true); }}
                className="btn-primary mt-2"
              >
                <Plus className="w-4 h-4" />
                New task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={setDeletingTask}
                onToggle={(id) => toggleTask.mutate(id)}
                toggleLoading={toggleTask.isPending}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationBar
            pagination={pagination}
            onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        )}
      </main>

      {/* Modals */}
      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        loading={createTask.isPending || updateTask.isPending}
      />

      <ConfirmDialog
        open={!!deletingTask}
        title="Delete task"
        description={`Are you sure you want to delete "${deletingTask?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        loading={deleteTask.isPending}
      />
    </>
  );
}
