import { StatusBadge } from '@/components/status-badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { db } from '@/db/db';
import { articleSubmissions, users, metadata } from '@/db/schema';
import { ArticleStatus } from '@/lib/consts';
import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function RecentArticles() {
  const submissions = await db
    .select({
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
    .orderBy(desc(articleSubmissions.createdAt))
    .limit(5);

  return (
    <Card>
      <div className="flex justify-between">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-2">
          <Link href="/editor/articles">
            <Button variant={'link'} className="text-green-500">
              View all
            </Button>
          </Link>
        </div>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission, index) => (
              <TableRow key={index}>
                <TableCell>{submission.title}</TableCell>
                <TableCell>
                  {(submission.ownerFirstName as string) +
                    ' ' +
                    submission.ownerLastName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={submission.status as ArticleStatus} />
                </TableCell>
                <TableCell>
                  {format(
                    new Date(submission.createdAt as string),
                    'MMM dd, yyyy'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
