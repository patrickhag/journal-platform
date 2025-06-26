import { Abstract } from '@/components/article/Abstract';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import { articleSubmissions } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import logger from '@/lib/logger';

type PageProps = { articleId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}) {
  try {
    const { articleId } = await params;
    const articleData = await db.query.articleSubmissions.findFirst({
      with: {
        metadata: {
          columns: {
            title: true,
            topics: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    if (!articleData) {
      return {
        title: 'The page you are looking for does not exist',
      };
    }

    return {
      openGraph: {
        title: articleData.metadata.title,
        // keywords: articleData.metadata.topics,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unknown error occurred');
    }
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;

  let articleData;

  try {
    articleData = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
        updatedAt: true,
        section: true,
        publishedFile: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
            subtitle: true,
            abstract: true,
          },
        },
        user: {
          columns: {
            firstName: true,
            lastName: true,
            affiliation: true,
            email: true,
            orcid: true,
          },
        },
        contributors: {
          columns: {
            name: true,
            role: true,
            affiliation: true,
            orcid: true,
            email: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unknown error occurred');
    }
  }

  return (
    <main className="px-8 py-6">
      <section className="flex flex-col gap-8">
        <div className="grid grid-cols-4 gap-2">
          {articleData ? (
            <>
              <Abstract articleData={articleData} />
              <LeftSideBar
                isAbstract={true}
                articleFile={articleData.publishedFile}
                articleId={articleId}
              />
            </>
          ) : (
            <div>Article not found</div>
          )}
        </div>
      </section>
    </main>
  );
}
