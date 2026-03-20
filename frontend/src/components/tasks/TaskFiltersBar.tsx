'use client';

import { useCallback, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { TaskFilters, TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const statuses: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const priorities: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, search: e.target.value, page: 1 });
    },
    [filters, onChange]
  );

  const hasActiveFilters = !!filters.status || !!filters.priority;

  return (
    <div className="space-y-3">
      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.search ?? ''}
            onChange={handleSearch}
            className="input pl-9"
            placeholder="Search tasks..."
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'btn-secondary gap-2',
            (showFilters || hasActiveFilters) && 'border-indigo-300 bg-indigo-50 text-indigo-600'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px]">
              {[filters.status, filters.priority].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Status</span>
            <div className="flex gap-1.5 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onChange({ ...filters, status: s.value, page: 1 })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                    filters.status === s.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Priority</span>
            <div className="flex gap-1.5 flex-wrap">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onChange({ ...filters, priority: p.value, page: 1 })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                    filters.priority === p.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => onChange({ ...filters, status: '', priority: '', page: 1 })}
              className="self-end text-xs text-red-500 hover:text-red-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
