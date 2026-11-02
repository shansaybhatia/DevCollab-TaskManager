import { useState } from 'react';
import TaskCard from './TaskCard';
import { Layers } from 'lucide-react';

const statusConfig = {
  'to-do': {
    label: 'To do',
    badgeVariant: 'to-do',
    dotColor: 'bg-slate-400',
  },
  inprogress: {
    label: 'In progress',
    badgeVariant: 'inprogress',
    dotColor: 'bg-indigo-500',
  },
  completed: {
    label: 'Completed',
    badgeVariant: 'completed',
    dotColor: 'bg-emerald-500',
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
      className="flex-1 min-w-[320px] max-w-[400px] flex flex-col"
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
      <div className="flex items-center justify-between mb-3 px-1 text-sm font-bold text-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${config.dotColor} ${
              status === 'inprogress' ? 'animate-pulse' : ''
            }`}
          />
          <span>{config.label}</span>
        </div>
        <span className="text-xs text-slate-600 bg-white border border-slate-200/90 shadow-2xs px-2.5 py-0.5 rounded-full font-semibold">
          {columnTasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 p-3 rounded-[var(--radius-card)] border transition-colors duration-200 min-h-[480px] space-y-3.5 ${
          isDragOver
            ? 'bg-indigo-50/40 border-indigo-400 border-dashed shadow-md scale-[1.01]'
            : 'bg-slate-100/50 border-slate-200/80'
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
          <div className="flex flex-col items-center justify-center h-48 rounded-[var(--radius-card)] border border-dashed border-slate-200/90 bg-white/40 text-center p-4">
            <Layers className="h-6 w-6 text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-500">No tasks in this lane</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Drag tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
