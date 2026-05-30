import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700',
        'transition-all duration-200',
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
