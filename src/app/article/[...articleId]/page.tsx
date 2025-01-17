import { Abstract } from '@/components/article/Abstract';
import Footer from '@/components/landingPage/footer';
import Header from '@/components/landingPage/header';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import { articleSubmissions } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string[] }>;
}) {
  const param = await params;
  const [articleId] = param.articleId;
  const articleData = await db.query.articleSubmissions.findFirst({
    columns: {
      id: true,
      updatedAt: true,
      section: true,
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
      files: {
        columns: {
          publicId: true,
          fileType: true,
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

  const articleFiles = articleData?.files;

  return (
    <main>
      <div className="font-sans">
        <Header />
        <main className="px-8 py-6">
          <section className="flex flex-col gap-8">
            <div className="grid grid-cols-4 gap-2">
              {articleData ? (
                <>
                  <Abstract articleData={articleData} />
                  <LeftSideBar isAbstract={true} articleFiles={articleFiles} />
                </>
              ) : (
                <div>Article not found</div>
              )}
            </div>
            <Footer />
          </section>
        </main>
      </div>
    </main>
  );
}
