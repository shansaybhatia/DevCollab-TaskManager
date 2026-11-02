export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-16 w-16 text-lg',
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 shadow-xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-slate-100 border border-slate-200 
        flex items-center justify-center text-slate-700 font-semibold shadow-xs ${className}`}
    >
      {initials || '?'}
    </div>
  );
}
