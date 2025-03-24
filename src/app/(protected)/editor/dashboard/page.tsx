import ChartSection from './Charts';
import RecentArticles from './Recents';
import SummaryCard from './SummaryCard';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <SummaryCard />
      <ChartSection />
      <RecentArticles />
    </div>
  );
}
