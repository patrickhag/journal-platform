import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/db';

async function getArticlesCount() {
  const articles = await db.query.articleSubmissions.findMany();

  const counts = {
    newSubmissions: articles.filter(
      (article) => article.articleStatus === 'PUBLISHED'
    ).length,
    published: articles.filter(
      (article) => article.articleStatus === 'SUBMITTED'
    ).length,
    underReview: articles.filter(
      (article) => article.articleStatus === 'UNDER REVIEW'
    ).length,
    accepted: articles.filter((article) => article.articleStatus === 'ACCEPTED')
      .length,
    rejected: articles.filter((article) => article.articleStatus === 'REJECTED')
      .length,
  };

  return counts;
}
export default async function SummaryCard() {
  const data = await getArticlesCount();
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Published</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.published}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>New Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.newSubmissions}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.underReview}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accepted</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.accepted}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.rejected}</span>
        </CardContent>
      </Card>
    </div>
  );
}
