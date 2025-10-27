import AddReviewerModal from '@/components/upload/AddReviewerModal';
import { Paginator } from '@/components/upload/Paginator';
import { ReviewCard } from '@/components/upload/ReviewCard';
import { Reviewers } from '@/components/upload/Reviewers';
import { Card } from '@/components/ui/card';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;
  return (
    <>
      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-semibold tracking-tight">Reviewers</h2>
        <ReviewCard />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Proposed reviewers list</h3>

          <div className="space-y-4">
            <Reviewers />
          </div>

          <AddReviewerModal />
        </div>
      </Card>
      <Paginator
        backLink="/author/new/meta"
        nextLink="/author/new/final"
        query={query}
      ></Paginator>
    </>
  );
};
export default Page;
