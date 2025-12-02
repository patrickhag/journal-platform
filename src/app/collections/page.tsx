import React from 'react';
import { CollectionsList } from './components/CollectionsList';

function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Collections</h1>
        <p className="text-gray-600 text-lg">
          Discover curated collections of research papers grouped by theme,
          topic, or event. Each collection represents a focused exploration of
          important academic and scientific domains.
        </p>
      </div>
      <CollectionsList />
    </div>
  );
}

export default CollectionsPage;
