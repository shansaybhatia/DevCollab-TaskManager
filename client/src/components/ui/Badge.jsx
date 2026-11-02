export default function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    owner: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 font-semibold',
    member: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    low: 'bg-sky-50 text-sky-700 border-sky-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-rose-50 text-rose-700 border-rose-200',
    'to-do': 'bg-slate-100 text-slate-600 border-slate-200',
    inprogress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
}
