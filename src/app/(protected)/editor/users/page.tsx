'use client';

import { UserTable } from './UserTable';
import { UsersTableSkeleton } from './UsersTableSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useGetAllUsers } from '@/hooks/useUsers';

const UsersPage = () => {
  const { data: users, isLoading } = useGetAllUsers();

  return (
    <div className="container mx-auto py-7">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Users Management
            </h2>
          </div>
          <CardDescription>
            View all users, assign roles, and manage account statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <UsersTableSkeleton />
          ) : (
            <UserTable data={users || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
