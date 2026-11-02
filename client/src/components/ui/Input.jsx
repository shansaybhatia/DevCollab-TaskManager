import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold text-[var(--color-ink-2)] tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-[var(--radius-btn)] border border-[var(--color-rule-2)] bg-[var(--color-paper-2)] px-4 py-2.5
              text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
              focus:border-[var(--color-focus)] focus:bg-[var(--color-paper-3)] focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)]
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-error)] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
