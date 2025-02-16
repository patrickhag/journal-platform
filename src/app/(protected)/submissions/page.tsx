import DashboardPannel from '@/components/Dashboard';
import Loader from '@/components/Loader';
import { Suspense } from 'react';

export default async function Dashboard({
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
          <Loader text="Loading..." />
        </div>
      }
    >
      <DashboardPannel searchParams={await searchParams} />
    </Suspense>
  );
}
