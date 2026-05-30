import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-xl', colorClass)}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}
