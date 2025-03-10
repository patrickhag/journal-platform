import DashboardPannel from '@/components/Dashboard';

export default async function Dashboard({}: {
  params: Promise<{ params: string }>;
}) {
  return <DashboardPannel />;
}
