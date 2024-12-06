import { ArticlesTable } from '@/components/articles-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/schema';
import { users, articleSubmissions, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function ArticlesPage() {
  const articles = await db
    .select({
      section: articleSubmissions.section,
      status: articleSubmissions.articleStatus,
      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
      createdAt: articleSubmissions.createdAt,
      title: metadata.title,
      id: articleSubmissions.id,
    })
    .from(articleSubmissions)
    .leftJoin(users, eq(articleSubmissions.userId, users.id))
    .leftJoin(metadata, eq(metadata.articleId, articleSubmissions.id));

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Manage articles and view their statuses
          </p>
          <ArticlesTable
            data={articles.map((article) => ({
              ...article,
              owner: article.ownerFirstName + ' ' + article.ownerLastName,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
