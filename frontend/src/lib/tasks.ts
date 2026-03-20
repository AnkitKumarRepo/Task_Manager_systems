import { api } from './axios';
import { Task, TasksResponse, TaskFilters, CreateTaskData, UpdateTaskData } from '@/types';

export const tasksApi = {
  getAll: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    const res = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<Task> => {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const res = await api.post<Task>('/tasks', data);
    return res.data;
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggle: async (id: string): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${id}/toggle`);
    return res.data;
  },
};
