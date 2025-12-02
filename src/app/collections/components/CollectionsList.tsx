'use client';

import { useGetCollections } from '@/hooks/useCollections';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { TCollections } from '@/types';

function CollectionCard({ collection }: { collection: TCollections }) {
  const status = (collection as any).status || 'ACTIVE';
  const deadline = (collection as any).deadline;

  const getStatusLabel = () => {
    if (status === 'ACTIVE') return 'Open for submissions';
    if (status === 'ARCHIVED') return 'Archived';
    if (status === 'INACTIVE') return 'Closed';
    return 'Open for submissions';
  };

  const formatDeadline = (deadline: Date | string | null | undefined) => {
    if (!deadline) return null;
    try {
      const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Collection Label */}
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Collection
        </p>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {collection.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {collection.description}
        </p>

        {/* Status and Deadline */}
        <div className="pt-3 space-y-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                status === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 border-green-300 font-medium'
                  : status === 'ARCHIVED'
                    ? 'bg-gray-50 text-gray-700 border-gray-300 font-medium'
                    : 'bg-red-50 text-red-700 border-red-300 font-medium'
              }
            >
              {getStatusLabel()}
            </Badge>
          </div>
          {deadline && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Submission deadline:</span>{' '}
              <span className="text-gray-600">{formatDeadline(deadline)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CollectionsList() {
  const { data: collections, isLoading } = useGetCollections();

  if (isLoading) {
    return (
      <div className="flex py-8">
        <span className="ml-2 text-sm text-gray-600">
          Loading collections...
        </span>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return <div className="text-gray-500 py-8">No collections found.</div>;
  }

  // Categorize collections
  const callsForPapers = collections.filter(
    (c) => (c as any).status === 'ACTIVE'
  );
  const otherCollections = collections.filter(
    (c) => (c as any).status !== 'ACTIVE'
  );

  return (
    <div className="space-y-8">
      {/* Call for Papers Section */}
      {callsForPapers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Calls for papers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {callsForPapers.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      )}

      {/* Collections Section */}
      {otherCollections.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no collections */}
      {callsForPapers.length === 0 && otherCollections.length === 0 && (
        <div className="text-gray-500 py-8 text-center">
          No collections found.
        </div>
      )}
    </div>
  );
}
