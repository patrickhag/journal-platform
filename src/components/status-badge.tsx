import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full', className, {
        'bg-blue-50 text-blue-600 border-blue-600/20': status === 'SUBMITTED',
        'bg-green-50 text-green-600 border-green-600/20': status === 'ACCEPTED',
        'bg-red-50 text-red-600 border-red-600/20': status === 'REJECTED',
        'bg-yellow-50 text-yellow-600 border-yellow-600/20':
          status === 'UNDER REVIEW',
        'bg-orange-50 text-orange-600 border-orange-600/20':
          status === 'ARCHIVED',
        'bg-purple-50 text-purple-600 border-purple-600/20':
          status === 'PUBLISHED',
        'bg-teal-50 text-teal-600 border-teal-600/20': status === 'APPROVED',
        'bg-amber-50 text-amber-600 border-amber-600/20':
          status === 'MINOR ISSUE',
        'bg-rose-50 text-rose-600 border-rose-600/20': status === 'MAJOR ISSUE',
      })}
    >
      {!className && (
        <span
          className={cn('mr-1 h-1.5 w-1.5 rounded-full', {
            'bg-blue-600': status === 'SUBMITTED',
            'bg-green-600': status === 'ACCEPTED',
            'bg-red-600': status === 'REJECTED',
            'bg-yellow-600': status === 'UNDER REVIEW',
            'bg-orange-600': status === 'ARCHIVED',
            'bg-purple-600': status === 'PUBLISHED',
            'bg-teal-600': status === 'APPROVED',
            'bg-amber-600': status === 'MINOR ISSUE',
            'bg-rose-600': status === 'MAJOR ISSUE',
          })}
        />
      )}
      {status}
    </Badge>
  );
}
