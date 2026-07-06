import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-text-dark text-sm font-medium">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-3.5 h-13 border border-border bg-white rounded-[18px] px-5 transition-all',
            error && 'border-red-500 focus-within:ring-red-500',
            'focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400'
          )}
        >
          {icon && <span className="text-text-light">{icon}</span>}
          <input
            ref={ref}
            className={cn(
              'border-none outline-none w-full text-base text-text-mid bg-transparent',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';