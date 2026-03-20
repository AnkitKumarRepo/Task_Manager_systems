'use client';

import { CheckCircle2, Clock, Loader2, ListTodo } from 'lucide-react';
import { Task } from '@/types';

interface StatsBarProps {
  tasks: Task[];
  total: number;
}

export function StatsBar({ tasks, total }: StatsBarProps) {
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total', value: total, icon: ListTodo, color: 'text-slate-600', bg: 'bg-slate-100' },
        { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'In progress', value: inProgress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
      ].map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="card p-4 flex items-center gap-3">
          <div className={`${bg} rounded-lg p-2`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
