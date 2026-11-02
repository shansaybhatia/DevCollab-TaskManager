import { useState } from 'react';
import TaskCard from './TaskCard';
import { Layers } from 'lucide-react';

const statusConfig = {
  'to-do': {
    label: 'To do',
    badgeVariant: 'to-do',
  },
  inprogress: {
    label: 'In progress',
    badgeVariant: 'inprogress',
  },
  completed: {
    label: 'Completed',
    badgeVariant: 'completed',
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
      <div className="flex items-center justify-between mb-3 px-1 text-sm font-semibold text-[var(--color-ink)]">
        <div className="flex items-center gap-2">
          {status === 'inprogress' && (
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          )}
          <span>{config.label}</span>
        </div>
        <span className="text-xs text-[var(--color-muted)] bg-[var(--color-paper-2)] border border-[var(--color-rule)] px-2.5 py-0.5 rounded-[var(--radius-pill)] font-mono">
          {columnTasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 p-3 rounded-[var(--radius-card)] border transition-colors duration-200 min-h-[480px] space-y-3.5 ${
          isDragOver
            ? 'glass-panel border-[var(--color-accent)] border-dashed shadow-2xl scale-[1.01]'
            : 'bg-[color-mix(in_oklch,var(--color-paper-2)_40%,transparent)] border-[var(--color-rule)]'
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
          <div className="flex flex-col items-center justify-center h-48 rounded-[var(--radius-card)] border border-dashed border-[var(--color-rule)] text-center p-4">
            <Layers className="h-6 w-6 text-[var(--color-muted)] mb-2 opacity-50" aria-hidden="true" />
            <p className="text-xs text-[var(--color-muted)]">No tasks in this lane</p>
            <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Drag tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
