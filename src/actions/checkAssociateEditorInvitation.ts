import { db } from '@/db/db';
import { associateEditorAssignments } from '@/db/schema';
import { informStaffEditorAboutAssociateInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';

export const checkAssociateEditor = async (
  articleId: string,
  invitationSign: string
) => {
  const isAcceptedOrDeclined = !!invitationSign;

  const foundArticle = await db.query.associateEditorAssignments.findFirst({
    where: eq(associateEditorAssignments.articleId, articleId),
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

  const articleTitle = foundArticle?.articleSubmissions.metadata.title;
  const staffEditorEmail = foundArticle?.staffEditor.email;
  const staffEditorName =
    foundArticle?.staffEditor.firstName +
    ' ' +
    foundArticle?.staffEditor.lastName;
  const associateEditorName =
    foundArticle?.user.firstName + ' ' + foundArticle?.user.lastName;

  let indicator;

  if (isAcceptedOrDeclined) {
    await db
      .update(associateEditorAssignments)
      .set({ status: 'ACCEPTED' })
      .where(eq(associateEditorAssignments.articleId, articleId));

    await informStaffEditorAboutAssociateInvitation({
      articleTitle: articleTitle as string,
      staffEditorEmail: staffEditorEmail as string,
      associateEditorName: associateEditorName as string,
      staffEditorName: staffEditorName as string,
      status: 'accepted',
    });

    indicator = true;
    return indicator;
  } else if (!isAcceptedOrDeclined) {
    await db
      .update(associateEditorAssignments)
      .set({ status: 'DECLINED' })
      .where(eq(associateEditorAssignments.articleId, articleId));

    await informStaffEditorAboutAssociateInvitation({
      articleTitle: articleTitle as string,
      staffEditorEmail: staffEditorEmail as string,
      associateEditorName: associateEditorName as string,
      staffEditorName: staffEditorName as string,
      status: 'rejected',
    });
    indicator = false;
    return indicator;
  }
};
