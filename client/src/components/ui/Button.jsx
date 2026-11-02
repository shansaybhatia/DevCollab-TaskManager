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
      'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-pill)]',
      md: 'px-4 py-2 text-sm rounded-[var(--radius-pill)]',
      lg: 'px-5 py-2.5 text-base rounded-[var(--radius-pill)]',
    };

    const variantStyles = {
      primary:
        'bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[oklch(88%_0.15_80)] active:bg-[oklch(76%_0.14_80)] font-semibold',
      secondary:
        'bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)] hover:bg-[var(--color-paper)]',
      outline:
        'border border-[var(--color-rule)] text-[var(--color-ink-2)] hover:border-[var(--color-rule-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]',
      ghost:
        'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]',
      danger:
        'bg-[var(--color-bad-soft)] text-[var(--color-bad)] border border-[var(--color-bad)] hover:bg-[var(--color-bad)] hover:text-[var(--color-paper)]',
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
