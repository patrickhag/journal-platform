import { DashboardCards } from './dashboard/DashboardCards';
import RecentArticles from './dashboard/Recents';
import SummaryCard from './dashboard/SummaryCard';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <SummaryCard />
      <DashboardCards />
      <RecentArticles />
    </div>
  );
}
