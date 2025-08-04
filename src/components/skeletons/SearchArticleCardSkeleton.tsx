import { Skeleton } from '../ui/skeleton';

export const SearchArticleCardSkeleton = ({
  count = 3,
}: {
  count?: number;
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-4 mb-3 shadow-sm"
        >
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </>
  );
};
