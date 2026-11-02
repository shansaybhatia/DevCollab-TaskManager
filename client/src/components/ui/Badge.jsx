export default function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    owner: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 font-semibold',
    member: 'bg-slate-800/80 text-slate-300 border-slate-700 font-medium',
    low: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    'to-do': 'bg-slate-800 text-slate-400 border-slate-700',
    inprogress: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
}
