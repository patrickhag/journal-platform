import { db } from '@/db/db';
import { and, eq } from 'drizzle-orm';
import { associateEditorAssignments } from '@/db/schema';

export const getAssociateEditorAssignments = async (userId: string) => {
  const assignedArticles = await db.query.associateEditorAssignments.findMany({
    where: and(
      eq(associateEditorAssignments.userId, userId),
      eq(associateEditorAssignments.status, 'ACCEPTED')
    ),
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
  return assignedArticles || [];
};
