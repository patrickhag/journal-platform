import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleCardSkeleton() {
  return (
    <div className="p-3 rounded-lg border bg-card shadow-sm flex flex-col gap-2 relative mb-2">
      {/* View Article Button - top right */}
      <div className="absolute top-3 right-3">
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      {/* Title */}
      <Skeleton className="h-5 w-1/2 rounded-md" />

      {/* Author */}
      <Skeleton className="h-4 w-1/4 rounded-md" />

      {/* Dates */}
      <div className="flex gap-3 mt-1">
        <Skeleton className="h-3.5 w-20 rounded-md" />
        <Skeleton className="h-3.5 w-20 rounded-md" />
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
