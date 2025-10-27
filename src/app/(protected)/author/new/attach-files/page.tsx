import { Card } from '@/components/ui/card';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { Paginator } from '@/components/upload/Paginator';

const Page = async ({
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;
  return (
    <>
      <Card className="mb-6 p-6">
        <h1 className="mb-6 text-3xl font-bold">Upload files</h1>
        <p className="text-sm my-5">
          Please select type for each file{' '}
          <span className="text-red-500">*</span>
        </p>
        <DragAndDropFileInput />
        <div className="space-y-4">
          <FileList />
        </div>
      </Card>

      <Paginator
        query={query}
        backLink="/author/new/start"
        nextLink="/author/new/meta"
      ></Paginator>
    </>
  );
};
export default Page;
