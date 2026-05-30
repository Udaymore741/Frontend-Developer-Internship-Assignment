import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-zinc-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50',
            'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors text-sm h-10 px-3',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-zinc-300 dark:border-zinc-600',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-zinc-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
