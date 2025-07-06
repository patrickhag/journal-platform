import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function AssignmentCardSkeleton() {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Title */}
            <Skeleton className="h-6 w-3/4 rounded-md" />

            {/* Author */}
            <Skeleton className="h-4 w-1/3 rounded-md" />

            {/* Dates */}
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>

            {/* Status badge */}
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* View Article button */}
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
