'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FinalSubmissionSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1a237e]">
          <Skeleton className="h-5 w-40" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question placeholders */}
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        ))}

        {/* Extra info */}
        <div className="pt-3 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="pt-2 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </CardContent>
    </Card>
  );
}
