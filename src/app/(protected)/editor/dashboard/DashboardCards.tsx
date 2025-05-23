'use client';

import { BookOpenCheck, EyeIcon, UserPlus } from 'lucide-react';
import { StatCard } from './StatCard';
import { useGetMetricsInteractions } from '@/hooks/useMetrics';
import { useGetUsers } from '@/hooks/useUsers';

export function DashboardCards() {
  const { data: interactions, isPending: isInteractionsPending } =
    useGetMetricsInteractions();

  const totalInteractions = interactions?.totalInteractions ?? 0;

  const { data, isPending: isUserPending } = useGetUsers();

  const allUsers = data?.allUsers ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
      <StatCard
        title="Total Citations"
        value={248}
        icon={BookOpenCheck}
        description="Academic references to published papers"
        iconClassName="bg-blue-100 dark:bg-blue-900"
      />
      <StatCard
        title="Total Users"
        value={allUsers}
        icon={UserPlus}
        description="Registered users on the platform"
        iconClassName="bg-emerald-100 dark:bg-emerald-900"
        isPending={isUserPending}
      />
      <StatCard
        title="Views & Downloads"
        value={totalInteractions}
        icon={EyeIcon}
        description="Total interactions on the platform"
        iconClassName="bg-amber-100 dark:bg-amber-900"
        isPending={isInteractionsPending}
      />
    </div>
  );
}
