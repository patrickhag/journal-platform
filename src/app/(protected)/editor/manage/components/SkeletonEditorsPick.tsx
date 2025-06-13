import { Skeleton } from '@/components/ui/skeleton';

export default function EditorsCardSkeleton() {
  return (
    <div className="flex justify-between items-start p-4 border rounded-md shadow-sm w-full max-w-3xl bg-white">
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" /> {/* Title */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" /> {/* Case Report */}
          <Skeleton className="h-4 w-24" /> {/* Author name */}
        </div>
      </div>
      <Skeleton className="h-10 w-36 rounded-md" /> {/* Remove Button */}
    </div>
  );
}
