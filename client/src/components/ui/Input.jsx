import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-2 text-left">
        {label && (
          <label className="block text-xs font-medium text-[var(--color-ink-2)] tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3
              text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
              focus:border-[var(--color-focus)] focus:bg-[var(--color-paper-3)] focus:outline-none
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-[var(--color-error)]' : ''}
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
