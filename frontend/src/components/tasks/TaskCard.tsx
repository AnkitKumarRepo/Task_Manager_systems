'use client';

import { Task } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { formatDate, isOverdue, cn } from '@/lib/utils';
import { Edit2, Trash2, Calendar, RotateCcw } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (id: string) => void;
  toggleLoading?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onToggle, toggleLoading }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={cn(
        'card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow',
        task.status === 'COMPLETED' && 'opacity-70'
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            'text-sm font-semibold text-slate-800 leading-snug flex-1',
            task.status === 'COMPLETED' && 'line-through text-slate-400'
          )}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggle(task.id)}
            disabled={toggleLoading}
            className="btn-ghost p-1.5 rounded-md text-slate-400 hover:text-indigo-600"
            title="Cycle status"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost p-1.5 rounded-md text-slate-400 hover:text-indigo-600"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="btn-ghost p-1.5 rounded-md text-slate-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        {task.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              overdue ? 'text-red-500 font-medium' : 'text-slate-400'
            )}
          >
            <Calendar className="w-3 h-3" />
            {overdue ? 'Overdue · ' : ''}
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
}
