import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/db';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

async function getArticlesCount() {
  const articles = await db.query.articleSubmissions.findMany();

  const counts = {
    newSubmissions: articles.filter(
      (article) => article.articleStatus === 'SUBMITTED'
    ).length,
    published: articles.filter(
      (article) => article.articleStatus === 'PUBLISHED'
    ).length,
    underReview: articles.filter(
      (article) => article.articleStatus === 'UNDER REVIEW'
    ).length,
    correction: articles.filter(
      (article) => article.articleStatus === 'CORRECTION'
    ).length,
    underPress: articles.filter(
      (article) => article.articleStatus === 'UNDER PRESS'
    ).length,
    rejected: articles.filter((article) => article.articleStatus === 'REJECTED')
      .length,
  };

  return counts;
}

export default async function SummaryCard() {
  const data = await getArticlesCount();

  const cards = [
    {
      title: 'New Submissions',
      value: data.newSubmissions,
      href: '/editor/manage-submissions',
    },
    {
      title: 'Under Review',
      value: data.underReview,
      href: '/editor/manage-under-reviews',
    },
    {
      title: 'Correction',
      value: data.correction,
      href: '/editor/manage-corrections',
    },
    {
      title: 'Under Press',
      value: data.underPress,
      href: '/editor/manage-under-press',
    },
    {
      title: 'Rejected',
      value: data.rejected,
      href: '/editor/manage-rejected',
    },
    {
      title: 'Published',
      value: data.published,
      href: '/editor/manage-published',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          target="_blank"
          className="relative group block"
        >
          {/* Hover icon */}
          <ArrowUpRight className="absolute top-3 right-3 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />

          <Card className="bg-card border border-border transition-transform duration-200 group-hover:-translate-y-1 relative z-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{card.value}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
