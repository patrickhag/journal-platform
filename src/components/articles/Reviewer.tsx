import { metadata, reviewAssignments } from '@/db/schema';
import { db } from '@/db/db';
import { ReachOut } from './ReachOut';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { formatStatus, getReviewAssignmentsStatusStyle } from '@/lib/utils';

export default async function Reviewer({
  reviewer: { id: reviewerId, email, names, affiliation, phone, expertise },
  index,
  articleId,
}: {
  reviewer: {
    id: string;
    affiliation: string;
    email: string;
    names: string;
    phone: string | null;
    expertise: string;
    articleId: string | null;
  };
  index: number;
  articleId: string;
}) {
  const [meta] = await db
    .select({
      title: metadata.title,
      subTitle: metadata.subtitle,
      content: metadata.abstract,
    })
    .from(metadata)
    .where(eq(metadata.articleId, articleId))
    .limit(1);

  const session = await auth();
  if (!session?.user?.id) return null;

  const hasUserAcceptedInvitation = await db.query.reviewAssignments.findMany({
    columns: {
      status: true,
      reviewerId: true,
    },
    where: eq(reviewAssignments.articleId, articleId),
  });

  const reviewerStatus = hasUserAcceptedInvitation.find(
    (invitation) => invitation.reviewerId === reviewerId
  );

  const currentUserRole = session?.user?.role;

  const statusStyle = getReviewAssignmentsStatusStyle(
    reviewerStatus?.status || 'PENDING'
  );

  return (
    <>
      <div className="flex justify-between items-center">
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
          proposed reviewer{' '}
        </h3>
        <span className={`text-center px-2 py-1 rounded-md ${statusStyle}`}>
          Invitation{' '}
          {reviewerStatus
            ? reviewerStatus.status === 'INVITED'
              ? 'Sent'
              : formatStatus(reviewerStatus.status as string)
            : 'Pending'}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Fullnames</h4>
          <p className="font-medium">{names}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Email</h4>
          <p className="font-medium">{email}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Affiliation</h4>
          <p className="font-medium">
            {affiliation ? affiliation : 'Not provided'}
          </p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Phone</h4>
          <p className="font-medium">{phone ? phone : 'Not provided'}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-muted-foreground mb-2">Expertise</h4>
        <p className="text-base">{expertise}</p>
      </div>
      {(currentUserRole === 'CHIEF_EDITOR' ||
        currentUserRole === 'ASSOCIATE_EDITOR') && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'}>
              {' '}
              <span className="flex items-center">
                Reach out <Send className="ml-2" />
              </span>{' '}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Reviewer</DialogTitle>
            </DialogHeader>
            <ReachOut
              article={{ ...meta, article: articleId }}
              reviewer={names}
              author={{
                avatar: '',
                name: session.user.name,
                role: session.user.email,
              }}
              toEmail={email}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
