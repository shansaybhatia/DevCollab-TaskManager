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
      'inline-flex flex-row items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs rounded-[var(--radius-btn)] min-h-[34px]',
      md: 'px-5 py-2 text-sm rounded-[var(--radius-btn)] min-h-[40px]',
      lg: 'px-6 py-2.5 text-base rounded-[var(--radius-btn)] min-h-[46px]',
    };

    const variantStyles = {
      primary:
        'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hi)] border border-[color-mix(in_oklab,var(--color-accent)_85%,white)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_3px_10px_rgba(79,70,229,0.22)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_18px_rgba(79,70,229,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
      secondary:
        'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
      outline:
        'border border-slate-300/80 bg-white/70 text-slate-700 hover:bg-white hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
      ghost:
        'text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[var(--radius-btn)]',
      danger:
        'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white active:scale-[0.98]',
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
            className="animate-spin h-4 w-4 shrink-0"
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
