'use client';

import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { LogOut, CheckSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
    toast.success('Logged out');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 rounded-lg p-1.5">
            <CheckSquare className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg">TaskFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <span>{user?.name || user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost text-sm"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
