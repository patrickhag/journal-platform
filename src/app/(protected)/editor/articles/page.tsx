import { ArticlesTable } from '@/components/articles-table';
import Protected from '@/components/Protected';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { FileText } from 'lucide-react';

export default async function ArticlesPage() {
  const articles = await db.query.articleSubmissions.findMany({
    columns: {
      section: true,
      articleStatus: true,
      id: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
      metadata: {
        columns: {
          title: true,
        },
      },
    },
    orderBy: [desc(articleSubmissions.createdAt)],
  });

  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-800" />
              <h2 className="text-2xl font-bold text-gray-900">
                Articles Management
              </h2>
            </div>
            <CardDescription className="mb-6">
              Manage articles and view their statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArticlesTable
              data={articles.map((article) => ({
                id: article.id,
                section: article.section,
                status: article.articleStatus,
                createdAt: article.createdAt,
                title: article.metadata.title,
                owner: article.user.firstName + ' ' + article.user.lastName,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
