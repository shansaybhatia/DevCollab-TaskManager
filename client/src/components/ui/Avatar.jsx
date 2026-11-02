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
        className={`${sizeClasses[size]} rounded-[var(--radius-pill)] object-cover border border-[var(--color-rule)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] 
        flex items-center justify-center text-[var(--color-ink)] font-mono font-medium ${className}`}
    >
      {initials || '?'}
    </div>
  );
}
