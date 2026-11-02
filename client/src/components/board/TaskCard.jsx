import { useState } from 'react';
import {
  Calendar,
  Trash2,
  Edit3,
  MoreVertical,
  GripVertical,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

export default function TaskCard({ task, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

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
    <div className="glass-card-interactive p-4 space-y-3 relative group">
      {/* Top Bar: Grip + Priority + Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-[var(--color-muted)] opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          <Badge variant={task.priority}>{task.priority}</Badge>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-[var(--radius-btn)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer"
            aria-label="Task options"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-[var(--z-dropdown)] w-36 rounded-[var(--radius-card)] border border-slate-200 bg-white shadow-xl py-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit task</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task._id);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs">
        {task.duedate ? (
          <div
            className={`inline-flex items-center gap-1.5 ${
              isOverdue ? 'text-rose-600 font-medium' : 'text-slate-500'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-mono">{formatDate(task.duedate)}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignedTo ? (
          <Avatar
            src={task.assignedTo.avatar}
            name={task.assignedTo.name || ''}
            size="sm"
            className="!h-6 !w-6 !text-[10px]"
          />
        ) : (
          <span className="text-[11px] text-slate-500">unassigned</span>
        )}
      </div>
    </div>
  );
}
