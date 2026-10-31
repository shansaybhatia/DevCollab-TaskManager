import { useState } from 'react';
import {
  GripVertical,
  Calendar,
  Trash2,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

export default function TaskCard({ task, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.duedate && new Date(task.duedate) < new Date() && task.status !== 'completed';

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm
        hover:shadow-md hover:border-slate-300 transition-all duration-150 group"
    >
      {/* Top Row — Priority + Menu */}
      <div className="flex items-center justify-between mb-2.5">
        <Badge variant={task.priority}>{priorityLabels[task.priority] || 'Medium'}</Badge>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded text-slate-400 opacity-0 group-hover:opacity-100
              hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-36 bg-white rounded-lg border border-slate-200 shadow-lg py-1 animate-scale-in">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task._id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Bottom Row — Date + Assignee */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
        {task.duedate ? (
          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.duedate)}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignedTo && (
          <Avatar
            src={task.assignedTo.avatar}
            name={task.assignedTo.name || ''}
            size="sm"
            className="!h-6 !w-6 !text-[10px]"
          />
        )}
      </div>
    </div>
  );
}
