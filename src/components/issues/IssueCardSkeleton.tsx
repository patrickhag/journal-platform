import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon, SendIcon } from 'lucide-react';

export default function IssueCardSkeleton() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-40 mt-2" />
        <Skeleton className="h-4 w-60 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="flex gap-4">
        <Button className="flex-1" variant="outline" disabled>
          <PlusIcon className="w-4 h-4 mr-2" />
          Assign Articles
        </Button>
        <Button className="flex-1" variant="default" disabled>
          <SendIcon className="w-4 h-4 mr-2" /> Publish Issue
        </Button>
      </div>
    </Card>
  );
}
