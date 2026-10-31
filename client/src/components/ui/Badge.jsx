const colorMap = {
  // Priority badges
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  high: 'bg-red-50 text-red-700 ring-red-600/20',
  // Status badges
  'to-do': 'bg-slate-50 text-slate-700 ring-slate-600/20',
  inprogress: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  // Generic
  default: 'bg-slate-50 text-slate-600 ring-slate-500/20',
  brand: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset
        ${colorMap[variant] || colorMap.default} ${className}`}
    >
      {children}
    </span>
  );
}
