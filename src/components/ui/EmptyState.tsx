import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-zinc-300 dark:text-zinc-600">{icon}</div>
      <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
      {description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">{description}</p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
