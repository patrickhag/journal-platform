import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonHeader() {
  return (
    <header className="bg-white border-b mb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-6 w-60" />
          </div>
        </div>
      </div>
    </header>
  );
}
