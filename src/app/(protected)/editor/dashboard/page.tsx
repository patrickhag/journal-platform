import { DashboardCards } from './DashboardCards';
import RecentArticles from './Recents';
import SummaryCard from './SummaryCard';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <SummaryCard />
      <DashboardCards />
      <RecentArticles />
    </div>
  );
}
