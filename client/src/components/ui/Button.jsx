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
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs rounded-[var(--radius-btn)] min-h-[34px]',
      md: 'px-4.5 py-2 text-sm rounded-[var(--radius-btn)] min-h-[40px]',
      lg: 'px-6 py-2.5 text-base rounded-[var(--radius-btn)] min-h-[46px]',
    };

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_14px_-2px_rgba(99,102,241,0.45)] hover:from-indigo-400 hover:via-indigo-500 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_20px_-1px_rgba(99,102,241,0.65)] active:translate-y-0 active:scale-[0.98]',
      secondary:
        'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 hover:border-indigo-400/50 shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
      outline:
        'border border-slate-700 text-slate-200 hover:border-indigo-400 hover:text-white hover:bg-slate-800/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
      ghost:
        'text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-[var(--radius-btn)]',
      danger:
        'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white active:scale-[0.98]',
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
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
