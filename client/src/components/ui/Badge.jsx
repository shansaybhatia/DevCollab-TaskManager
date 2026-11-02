export default function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    low: 'bg-[var(--color-ok-soft)] text-[var(--color-ok)] border-[var(--color-ok-soft)]',
    medium: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-soft)]',
    high: 'bg-[var(--color-bad-soft)] text-[var(--color-bad)] border-[var(--color-bad-soft)]',
    'to-do': 'bg-[var(--color-paper-3)] text-[var(--color-muted)] border-[var(--color-rule)]',
    inprogress: 'bg-[var(--color-cool-soft)] text-[var(--color-cool)] border-[var(--color-cool-soft)]',
    completed: 'bg-[var(--color-ok-soft)] text-[var(--color-ok)] border-[var(--color-ok-soft)]',
    default: 'bg-[var(--color-paper-3)] text-[var(--color-ink-2)] border-[var(--color-rule)]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-xs font-mono font-medium leading-none ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
}
