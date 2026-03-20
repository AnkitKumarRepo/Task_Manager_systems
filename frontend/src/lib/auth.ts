import { api } from './axios';
import { AuthResponse, User } from '@/types';

export const authApi = {
  register: async (data: { email: string; password: string; name?: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data;
  },
};
