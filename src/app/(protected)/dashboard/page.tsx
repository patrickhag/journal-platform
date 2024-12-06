import DashboardPannel from '@/components/Dashboard';

export default async function Dashboard({
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <DashboardPannel searchParams={await searchParams} />;
}
