import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-medium text-[var(--color-ink-2)]">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-muted)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3.5 py-2.5
              text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
              focus-visible:border-[var(--color-focus)] focus-visible:outline-none
              transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
              ${Icon ? 'pl-9' : ''}
              ${error ? 'border-[var(--color-bad)]' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-bad)] mt-1 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
