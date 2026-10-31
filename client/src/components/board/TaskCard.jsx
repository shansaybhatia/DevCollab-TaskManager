import { useState } from 'react';
import {
  Calendar,
  Trash2,
  Edit3,
  MoreVertical,
  Clock,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

const priorityConfig = {
  low: {
    border: 'border-l-emerald-500',
    badge: 'low',
    label: 'Low',
  },
  medium: {
    border: 'border-l-amber-500',
    badge: 'medium',
    label: 'Medium',
  },
  high: {
    border: 'border-l-rose-500',
    badge: 'high',
    label: 'High Priority',
  },
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue =
    task.duedate &&
    new Date(task.duedate) < new Date() &&
    task.status !== 'completed';

  return (
    <div
      className={`group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs
        hover:shadow-md hover:border-slate-300 card-hover-lift transition-all duration-200
        border-l-4 ${priority.border}`}
    >
      {/* Header bar: Grip + Priority + Dropdown Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5 text-slate-300 opacity-40 group-hover:opacity-100 transition-opacity" />
          <Badge variant={priority.badge}>{priority.label}</Badge>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-md text-slate-400 opacity-0 group-hover:opacity-100
              hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-7 z-30 w-36 rounded-xl border border-slate-200 bg-white shadow-xl py-1 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Task</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task._id);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Card Footer: Metadata (due date, assignee) */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100/90 text-xs">
        {task.duedate ? (
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-[11px] ${
              isOverdue
                ? 'bg-rose-50 text-rose-600 font-semibold'
                : 'text-slate-500 bg-slate-50'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="h-3 w-3 text-rose-500" />
            ) : (
              <Calendar className="h-3 w-3 text-slate-400" />
            )}
            <span>{formatDate(task.duedate)}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignedTo ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden group-hover:inline transition-opacity truncate max-w-[80px]">
              {task.assignedTo.name?.split(' ')[0]}
            </span>
            <Avatar
              src={task.assignedTo.avatar}
              name={task.assignedTo.name || ''}
              size="sm"
              className="!h-6 !w-6 !text-[10px] ring-2 ring-indigo-50 shadow-xs"
            />
          </div>
        ) : (
          <span className="text-[10px] text-slate-300 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}
