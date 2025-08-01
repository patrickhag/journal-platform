'use client';

import { useGetCollections } from '@/hooks/useCollections';
import { Link } from '@react-email/components';

export function CollectioinsList() {
  const { data: collections } = useGetCollections();
  console.log('collections>>>', collections);

  return (
    <div className="space-y-4">
      {collections?.map((collection) => (
        <div key={collection.id} className="border-b border-gray-100 pb-4">
          <Link
            href={`/collections/${collection.slug}`}
            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
          >
            <h4 className="text-lg font-semibold text-gray-900">
              {collection.title}
            </h4>
            <p className="text-sm text-gray-500">
              {collection.collectionArticles.length}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
