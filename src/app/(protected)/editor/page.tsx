import { ArticlesTable } from '@/components/articles-table';
import Protected from '@/components/Protected';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db, people } from '@/db/schema';
import { users, articles as articleSubmissions, articleMetadata as metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function ArticlesPage() {
  const articles = await db
    .select({
      section: articleSubmissions.section,
      status: articleSubmissions.articleStatus,
      ownerFirstName: people.firstName,
      ownerLastName: people.lastName,
      createdAt: articleSubmissions.createdAt,
      title: metadata.title,
      id: articleSubmissions.id,
    })
    .from(articleSubmissions)
    .leftJoin(people, eq(articleSubmissions.submittedBy, people.id))
    .leftJoin(users, eq(articleSubmissions.submittedBy, users.id))
    .leftJoin(metadata, eq(metadata.articleId, articleSubmissions.id));

  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
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
    </Protected>
  );
}
