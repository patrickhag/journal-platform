import { Skeleton } from '@/components/ui/skeleton';

export default function MetricsCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />{' '}
    </div>
  );
}
