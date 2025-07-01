'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CollectionCard from './components/CollectionCard';
import CreateCollectionModal from './components/CreateCollectionModal';
import { useGetCollections } from '@/hooks/useCollections';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const { data: collections } = useGetCollections();

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Collection Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage, track largest collection and their articles.
            </p>
          </div>
        </div>
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections?.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>

        {<CreateCollectionModal isOpen={isOpen} onClose={onClose} />}
      </div>
    </div>
  );
}
