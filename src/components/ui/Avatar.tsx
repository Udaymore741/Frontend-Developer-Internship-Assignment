import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Deterministic colour from name
const colours = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-emerald-500',
];

function getColour(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colours[Math.abs(hash) % colours.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', sizeClasses[size], className)}
        onError={(e) => {
          // Fallback to initials on image error
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0',
        getColour(name),
        sizeClasses[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
