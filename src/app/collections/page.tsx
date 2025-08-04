import React from 'react';
import { CollectionsList } from './components/CollectionsList';

function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Collections</h1>
      <p>
        Discover curated collections of research papers grouped by theme, topic,
        or event. Each collection represents a focused exploration of important
        academic and scientific domains.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 my-8">
        <CollectionsList />
      </div>
    </div>
  );
}

export default CollectionsPage;
