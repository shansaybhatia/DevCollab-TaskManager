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
    <div className="console-panel p-3.5 space-y-2.5 relative group hover:border-[var(--color-rule-2)] transition-colors">
      {/* Top Bar: Grip + Priority + Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5 text-[var(--color-muted)] opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          <Badge variant={task.priority}>{task.priority}</Badge>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer"
            aria-label="Task options"
          >
            <MoreVertical className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-7 z-[var(--z-dropdown)] w-32 rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-xl py-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task._id);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[var(--color-bad)] hover:bg-[var(--color-bad-soft)] transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-[var(--color-ink)] leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-rule)] text-[11px] font-mono">
        {task.duedate ? (
          <div
            className={`inline-flex items-center gap-1 ${
              isOverdue ? 'text-[var(--color-bad)]' : 'text-[var(--color-muted)]'
            }`}
          >
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span>{formatDate(task.duedate)}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignedTo ? (
          <Avatar
            src={task.assignedTo.avatar}
            name={task.assignedTo.name || ''}
            size="sm"
            className="!h-5 !w-5 !text-[9px]"
          />
        ) : (
          <span className="text-[10px] text-[var(--color-muted)]">unassigned</span>
        )}
      </div>
    </div>
  );
}
