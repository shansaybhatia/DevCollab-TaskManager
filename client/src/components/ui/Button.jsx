import { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled,
      isLoading,
      icon: Icon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2.5 font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'px-3.5 py-2 text-xs rounded-[var(--radius-pill)] min-h-[36px]',
      md: 'px-5 py-2.5 text-sm rounded-[var(--radius-pill)] min-h-[44px]',
      lg: 'px-6 py-3.5 text-base rounded-[var(--radius-pill)] min-h-[50px]',
    };

    const variantStyles = {
      primary:
        'bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-hi)] hover:-translate-y-0.5 active:translate-y-0 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
      secondary:
        'glass-panel text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'border border-[var(--color-rule)] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] hover:-translate-y-0.5 active:translate-y-0',
      ghost:
        'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]',
      danger:
        'bg-[color-mix(in_oklch,var(--color-error)_18%,transparent)] text-[var(--color-error)] border border-[color-mix(in_oklch,var(--color-error)_40%,transparent)] hover:bg-[var(--color-error)] hover:text-[var(--color-paper)]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : Icon ? (
          <Icon className="h-4 w-4" aria-hidden="true" />
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
