import { ArticlesTable } from '@/components/articles-table';
import Protected from '@/components/Protected';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db/schema';
import { users, articleSubmissions, metadata } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

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
    .leftJoin(metadata, eq(metadata.articleId, articleSubmissions.id))
    .orderBy(desc(articleSubmissions.createdAt));

  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Articles</CardTitle>
            <CardDescription className="mb-6">
              Manage articles and view their statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
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
