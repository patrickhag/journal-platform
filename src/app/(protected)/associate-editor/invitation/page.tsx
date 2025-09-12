import { db } from '@/db/db';
import { associateEditorAssignments } from '@/db/schema';
import { informStaffEditorAboutAssociateInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function AcceptPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const articleId = search.articleId;
  const invitationSign = search.accept_invite;
  const isAcceptedOrDeclined = !!invitationSign;

  const foundArticle = await db.query.associateEditorAssignments.findFirst({
    where: eq(associateEditorAssignments.articleId, articleId as string),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
      staffEditor: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      articleSubmissions: {
        columns: {
          id: true,
        },
        with: {
          metadata: {
            columns: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!foundArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600 font-semibold">
          Invalid or expired invitation link.
        </p>
      </div>
    );
  }

  if (foundArticle.status === 'ACCEPTED') {
    redirect(
      `/associate-editor/assignments?message='You have already accepted this invitation.'`
    );
  }

  if (foundArticle.status === 'DECLINED') {
    redirect(
      `/associate-editor/assignments?message='You have already declined this invitation.'`
    );
  }

  const articleTitle = foundArticle?.articleSubmissions.metadata.title;
  const staffEditorEmail = foundArticle?.staffEditor.email;
  const staffEditorName =
    foundArticle?.staffEditor.firstName +
    ' ' +
    foundArticle?.staffEditor.lastName;
  const associateEditorName =
    foundArticle?.user.firstName + ' ' + foundArticle?.user.lastName;

  if (isAcceptedOrDeclined) {
    await db
      .update(associateEditorAssignments)
      .set({ status: 'ACCEPTED' })
      .where(eq(associateEditorAssignments.articleId, articleId as string));

    await informStaffEditorAboutAssociateInvitation({
      articleTitle: articleTitle as string,
      staffEditorEmail: staffEditorEmail as string,
      associateEditorName: associateEditorName as string,
      staffEditorName: staffEditorName as string,
      status: 'accepted',
    });
    redirect(`/associate-editor/assignments?isAccepted=1`);
  } else if (!isAcceptedOrDeclined) {
    await db
      .update(associateEditorAssignments)
      .set({ status: 'DECLINED' })
      .where(eq(associateEditorAssignments.articleId, articleId as string));

    await informStaffEditorAboutAssociateInvitation({
      articleTitle: articleTitle as string,
      staffEditorEmail: staffEditorEmail as string,
      associateEditorName: associateEditorName as string,
      staffEditorName: staffEditorName as string,
      status: 'rejected',
    });
    redirect(`/associate-editor/assignments?isAccepted=0`);
  }
  return <p>Redirecting...</p>;
}
