import { db } from '@/db/db';
import { reviewAssignments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import withPermissions from '@/components/WithPermission';
import { AssignReviewerModal } from './AssignReviewersModal';
import ConditionalRender from '@/components/ConditionalRender';

interface AssignedReviewersProps {
  articleId: string;
}

async function AssignedReviewers({ articleId }: AssignedReviewersProps) {
  const assignedReviewers = await db.query.reviewAssignments.findMany({
    where: eq(reviewAssignments.articleId, articleId),
    with: {
      reviewer: true,
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      article: {
        columns: {
          articleStatus: true,
        },
      },
    },
    orderBy: desc(reviewAssignments.assignedDate),
  });

  if (assignedReviewers.length === 0) {
    return null;
  }

  return (
    <Card className="my-3">
      <div className="flex justify-between items-center mb-3">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1a237e]">
            Assigned Reviewers
          </CardTitle>
        </CardHeader>
        <ConditionalRender
          status={assignedReviewers[0]?.article?.articleStatus as string}
          hideOn={['PUBLISHED']}
        >
          <AssignReviewerModal />
        </ConditionalRender>
      </div>
      <CardContent className="space-y-5">
        {assignedReviewers.map((assignment, index) => (
          <div key={assignment.id}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {index + 1}
                <sup>
                  {index === 0
                    ? 'st'
                    : index === 1
                      ? 'nd'
                      : index === 2
                        ? 'rd'
                        : 'th'}
                </sup>{' '}
                assigned reviewer
              </h3>
              <Badge
                variant={'outline'}
                className={`text-center px-2 py-1 rounded-md`}
              >
                {assignment.status}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">
                  Fullnames
                </h4>
                <p className="font-medium">
                  {assignment.reviewer?.names ||
                    `${assignment.user?.firstName || ''} ${assignment.user?.lastName || ''}`.trim() ||
                    'Not provided'}
                </p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Email</h4>
                <p className="font-medium">
                  {assignment.reviewer?.email ||
                    assignment.user?.email ||
                    'Not provided'}
                </p>
              </div>
              {assignment.reviewer && (
                <>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">
                      Affiliation
                    </h4>
                    <p className="font-medium">
                      {assignment.reviewer.affiliation || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">
                      Phone
                    </h4>
                    <p className="font-medium">
                      {assignment.reviewer.phone || 'Not provided'}
                    </p>
                  </div>
                </>
              )}
              {assignment.assignedDate && (
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">
                    Assigned Date
                  </h4>
                  <p className="font-medium">
                    {new Date(assignment.assignedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {assignment.dueDate && (
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">
                    Due Date
                  </h4>
                  <p className="font-medium">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-sm text-muted-foreground mb-2">Expertise</h4>
              <p className="text-base">
                {assignment?.reviewer?.expertise || 'Not provided'}
              </p>
            </div>

            {index !== assignedReviewers.length - 1 && (
              <Separator className="mt-5" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export const AssignedReviewersWithPermissions =
  withPermissions(AssignedReviewers);
