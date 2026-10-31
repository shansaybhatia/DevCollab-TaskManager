import { useState } from 'react';
import TaskCard from './TaskCard';
import { Layers } from 'lucide-react';

const statusConfig = {
  'to-do': {
    label: 'To Do',
    color: 'bg-slate-400',
    lightBg: 'bg-slate-100/70',
    borderColor: 'border-slate-300',
    glowColor: 'ring-slate-300',
    headerBadge: 'bg-slate-100 text-slate-700',
  },
  inprogress: {
    label: 'In Progress',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50/40',
    borderColor: 'border-blue-300',
    glowColor: 'ring-blue-300',
    headerBadge: 'bg-blue-50 text-blue-700',
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50/40',
    borderColor: 'border-emerald-300',
    glowColor: 'ring-emerald-300',
    headerBadge: 'bg-emerald-50 text-emerald-700',
  },
};

export default function KanbanColumn({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = statusConfig[status] || statusConfig['to-do'];
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div
      className="flex-1 min-w-[320px] max-w-[420px] flex flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        if (onDragOver) onDragOver(e);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(status);
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3.5 px-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {status === 'inprogress' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`} />
          </span>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            {config.label}
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${config.headerBadge}`}
        >
          {columnTasks.length}
        </span>
      </div>

      {/* Column Body / Drop Zone */}
      <div
        className={`flex-1 p-2.5 rounded-2xl border-2 transition-all duration-200 min-h-[420px] space-y-3.5
          ${
            isDragOver
              ? 'bg-indigo-50/60 border-indigo-400 border-dashed shadow-inner scale-[1.01]'
              : 'bg-slate-100/50 border-transparent'
          }`}
      >
        {columnTasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={() => onDragStart(task)}
            className="cursor-grab active:cursor-grabbing transform transition-transform duration-150 active:scale-98"
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}

        {columnTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-slate-200 text-center p-4">
            <Layers className="h-6 w-6 text-slate-300 mb-2 opacity-60" />
            <p className="text-xs font-semibold text-slate-400">No tasks in this lane</p>
            <p className="text-[11px] text-slate-300 mt-0.5">Drag tasks here to update status</p>
          </div>
        )}
      </div>
    </div>
  );
}
