import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5
              text-sm text-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-colors duration-150
              disabled:bg-slate-50 disabled:text-slate-500
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
