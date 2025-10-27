import { Card, CardContent } from '@/components/ui/card';
import { ArticleTypeSection } from '@/components/upload/ArticleTypeSection';
import { CommentForEditor } from '@/components/upload/CommentForEditor';
import { Paginator } from '@/components/upload/Paginator';
import { SubmissionRequirementsSection } from '@/components/upload/SubmissionRequirementsSection';

const Page = async ({
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          <ArticleTypeSection />
          <SubmissionRequirementsSection />
          <div className="mt-4 mb-8 py-3 ">
            <h2 className="mb-4">Comments for the editors</h2>
            <CommentForEditor />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="text-red-500">*</span> Denotes a required field
        </p>
      </CardContent>
      <div className="my-8 max-[350px]:my-12 sm:my-6 mx-6">
        <Paginator
          nextLink="/author/new/attach-files"
          query={query}
        ></Paginator>
      </div>
    </Card>
  );
};
export default Page;
