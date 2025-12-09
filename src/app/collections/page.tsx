import React from 'react';
import type { Metadata } from 'next';
import { CollectionsList } from './components/CollectionsList';
import { db } from '@/db/db';

const baseUrl = process.env.NEXT_PUBLIC_URL || '';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Discover curated collections of research papers grouped by theme, topic, or event. Each collection represents a focused exploration of important academic and scientific domains in African Epidemiology and Public Health.',
  alternates: {
    canonical: `${baseUrl}/collections`,
  },
  openGraph: {
    title: 'Collections | Journal of African Epidemiology and Public Health',
    description:
      'Discover curated collections of research papers grouped by theme, topic, or event. Each collection represents a focused exploration of important academic and scientific domains.',
    url: `${baseUrl}/collections`,
    siteName: 'Journal of African Epidemiology and Public Health',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Journal of African Epidemiology and Public Health',
    description:
      'Discover curated collections of research papers grouped by theme, topic, or event. Each collection represents a focused exploration of important academic and scientific domains.',
  },
};

async function CollectionsPage() {
  const allCollections = await db.query.collections.findMany({
    orderBy: (collections, { desc }) => [desc(collections.createdAt)],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Collections</h1>
        <p className="text-gray-600 text-lg">
          Discover curated collections of research papers grouped by theme,
          topic, or event. Each collection represents a focused exploration of
          important academic and scientific domains.
        </p>
        <CollectionsList collections={allCollections} />
      </div>
    </div>
  );
}

export default CollectionsPage;
