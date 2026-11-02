export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="console-panel flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="mb-4 p-3 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-muted)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--color-ink)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-muted)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
