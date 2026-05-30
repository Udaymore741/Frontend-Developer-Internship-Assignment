import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { timeAgo } from '@/lib/utils';

const activities = [
  { id: 1, user: 'Sarah Chen', action: 'completed "Set up error monitoring with Sentry"', time: '2025-05-28T10:00:00.000Z' },
  { id: 2, user: 'Marcus Williams', action: 'moved "Refactor payment service" to In Progress', time: '2025-05-27T15:30:00.000Z' },
  { id: 3, user: 'Priya Patel', action: 'created "Audit accessibility on marketing site"', time: '2025-05-27T09:00:00.000Z' },
  { id: 4, user: 'Aisha Kamara', action: 'started "Build notification centre UI"', time: '2025-05-26T14:00:00.000Z' },
  { id: 5, user: 'Tom Nakamura', action: 'submitted "PR: Dark mode for dashboard" for review', time: '2025-05-25T11:00:00.000Z' },
];

export function ActivityFeed() {
  return (
    <Card>
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Recent Activity
      </h2>
      <ul className="space-y-4">
        {activities.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            <Avatar name={a.user} size="sm" className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{a.user}</span> {a.action}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{timeAgo(a.time)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
