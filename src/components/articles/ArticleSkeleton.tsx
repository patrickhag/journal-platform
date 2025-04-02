import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ArticleSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex gap-6">
          <Skeleton className="h-6 w-12 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-5 w-64 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardContent>
    </Card>
  );
}
