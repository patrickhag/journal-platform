import AddReviewerModal from "@/components/upload/AddReviewerModal";
import { Paginator } from "@/components/upload/Paginator";
import { ReviewCard } from "@/components/upload/ReviewCard";
import { Reviewers } from "@/components/upload/Reviewers";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  console.log("query search param object :", await searchParams);
  const query = await searchParams;
  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Reviewers</h2>
        <ReviewCard />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Proposed reviewers list</h3>

          <div className="space-y-4">
            <Reviewers />
          </div>

          <AddReviewerModal />
          <Paginator
            backLink="/articles/new/meta"
            nextLink="/articles/new/final"
            query={query}
          ></Paginator>
        </div>
      </div>
    </>
  );
};
export default Page;
