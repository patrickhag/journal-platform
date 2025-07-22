import { Skeleton } from '@/components/ui/skeleton';

export default function PublishedArticleSkeleton() {
  return (
    <div className="px-8 py-6 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" /> {/* Case Study badge */}
        <Skeleton className="h-8 w-3/4" /> {/* Title */}
        <Skeleton className="h-6 w-1/2" /> {/* Subtitle */}
        <div className="flex gap-3 flex-wrap">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Authors */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-28" /> {/* Authors heading */}
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Three-Column Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Abstract */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
