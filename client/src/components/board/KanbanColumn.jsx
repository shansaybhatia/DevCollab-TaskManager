import TaskCard from './TaskCard';

const statusConfig = {
  'to-do': {
    label: 'To Do',
    color: 'bg-slate-400',
    lightBg: 'bg-slate-50',
  },
  inprogress: {
    label: 'In Progress',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50',
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
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
  const config = statusConfig[status] || statusConfig['to-do'];
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div
      className="flex-1 min-w-[300px] max-w-[400px]"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.querySelector('.drop-zone')?.classList.add('bg-indigo-50', 'border-indigo-300');
      }}
      onDragLeave={(e) => {
        e.currentTarget.querySelector('.drop-zone')?.classList.remove('bg-indigo-50', 'border-indigo-300');
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.querySelector('.drop-zone')?.classList.remove('bg-indigo-50', 'border-indigo-300');
        onDrop(status);
      }}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
        <h3 className="text-sm font-semibold text-slate-700">{config.label}</h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {columnTasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="drop-zone space-y-3 p-2 rounded-xl border-2 border-dashed border-transparent 
          min-h-[200px] transition-colors duration-200"
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
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
