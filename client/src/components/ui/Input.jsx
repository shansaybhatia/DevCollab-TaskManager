import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-[var(--radius-btn)] border border-slate-200 bg-white/90 px-4 py-2.5
              text-sm text-slate-900 placeholder:text-slate-400
              focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20
              transition-colors duration-200 shadow-xs
              disabled:opacity-40 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
