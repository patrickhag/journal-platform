import { Card } from "@/components/ui/card";
import { FileList } from "@/components/upload/FileList";
import { Paginator } from "@/components/upload/Paginator";
import { Uploadbanner } from "@/components/upload/Uploadbanner";

const fileFormats = [".DOC*", ".PDF"];

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  console.log("param object :", await params);
  console.log("query search param object :", await searchParams);
  const query = await searchParams;
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Upload files</h1>
      <Card className="mb-6 p-6">
        <Uploadbanner fileFormats={fileFormats} />
        <div className="space-y-4">
          <FileList />
        </div>
      </Card>

      <Paginator
        query={query}
        backLink="/articles/start"
        nextLink="/articles/meta"
      ></Paginator>
    </>
  );
};
export default Page;
