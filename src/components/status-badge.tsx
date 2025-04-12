import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArticleStatus } from '@/lib/consts';

export function StatusBadge({
  status,
  className,
}: {
  status: ArticleStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full', className, {
        'bg-blue-50 text-blue-600 border-blue-600/20': status === 'Submitted',
        'bg-green-50 text-green-600 border-green-600/20': status === 'Accepted',
        'bg-red-50 text-red-600 border-red-600/20': status === 'Rejected',
        'bg-yellow-50 text-yellow-600 border-yellow-600/20':
          status === 'Under Review',
        'bg-orange-50 text-orange-600 border-orange-600/20':
          status === 'Archived',
        'bg-purple-50 text-purple-600 border-purple-600/20':
          status === 'Published',
        'bg-teal-50 text-teal-600 border-teal-600/20': status === 'Approved',
        'bg-amber-50 text-amber-600 border-amber-600/20':
          status === 'Minor issue',
        'bg-rose-50 text-rose-600 border-rose-600/20': status === 'Major issue',
      })}
    >
      {!className && (
        <span
          className={cn('mr-1 h-1.5 w-1.5 rounded-full', {
            'bg-blue-600': status === 'Submitted',
            'bg-green-600': status === 'Accepted',
            'bg-red-600': status === 'Rejected',
            'bg-yellow-600': status === 'Under Review',
            'bg-orange-600': status === 'Archived',
            'bg-purple-600': status === 'Published',
            'bg-teal-600': status === 'Approved',
            'bg-amber-600': status === 'Minor issue',
            'bg-rose-600': status === 'Major issue',
          })}
        />
      )}
      {status}
    </Badge>
  );
}
