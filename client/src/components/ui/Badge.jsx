export default function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    low: 'bg-[color-mix(in_oklch,var(--point-mid)_15%,transparent)] text-[var(--point-mid)] border-[color-mix(in_oklch,var(--point-mid)_30%,transparent)]',
    medium: 'bg-[color-mix(in_oklch,var(--color-amber)_15%,transparent)] text-[var(--color-amber)] border-[color-mix(in_oklch,var(--color-amber)_30%,transparent)]',
    high: 'bg-[color-mix(in_oklch,var(--color-error)_15%,transparent)] text-[var(--color-error)] border-[color-mix(in_oklch,var(--color-error)_30%,transparent)]',
    'to-do': 'bg-[var(--color-paper-3)] text-[var(--color-muted)] border-[var(--color-rule-2)]',
    inprogress: 'bg-[color-mix(in_oklch,var(--point-mid)_15%,transparent)] text-[var(--point-mid)] border-[color-mix(in_oklch,var(--point-mid)_30%,transparent)]',
    completed: 'bg-[color-mix(in_oklch,var(--color-accent)_16%,transparent)] text-[var(--color-accent)] border-[color-mix(in_oklch,var(--color-accent)_35%,transparent)]',
    default: 'bg-[var(--color-paper-3)] text-[var(--color-ink-2)] border-[var(--color-rule)]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium leading-none ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
}
