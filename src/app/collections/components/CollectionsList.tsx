'use client';

import { useGetCollections } from '@/hooks/useCollections';
import Link from 'next/link';

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

  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <div key={collection.id} className="border-b border-gray-100 pb-4">
          <Link
            href={`/collections/${collection.slug}`}
            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
          >
            <h4 className="text-lg font-semibold text-gray-900">
              {collection.title}
            </h4>
            <p className="text-sm text-gray-500">
              {collection.collectionArticles.length} article(s) in this
              collection.
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
