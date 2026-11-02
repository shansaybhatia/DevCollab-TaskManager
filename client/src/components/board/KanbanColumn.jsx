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
      className="flex-1 min-w-[280px] max-w-[360px] flex flex-col"
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
      <div className="flex items-center justify-between mb-3 px-1 text-xs font-mono">
        <span className="font-semibold text-[var(--color-ink)]">
          {config.label}
        </span>
        <span className="text-[var(--color-muted)] bg-[var(--color-paper-2)] border border-[var(--color-rule)] px-2 py-0.5 rounded-[var(--radius-pill)]">
          {columnTasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 p-2 rounded-[var(--radius-card)] border transition-colors min-h-[460px] space-y-2.5 ${
          isDragOver
            ? 'bg-[var(--color-paper-2)] border-[var(--color-accent)] border-dashed'
            : 'bg-[var(--color-paper-3)] border-[var(--color-rule)]'
        }`}
      >
        {columnTasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={() => onDragStart(task)}
            className="cursor-grab active:cursor-grabbing"
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}

        {columnTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 rounded-[var(--radius-card)] border border-dashed border-[var(--color-rule)] text-center p-4">
            <Layers className="h-5 w-5 text-[var(--color-muted)] mb-1 opacity-50" aria-hidden="true" />
            <p className="text-xs text-[var(--color-muted)]">No tasks in lane</p>
          </div>
        )}
      </div>
    </div>
  );
}
