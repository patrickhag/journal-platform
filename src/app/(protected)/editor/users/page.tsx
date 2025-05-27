'use client';

import Loader from '@/components/Loader';
import { UserTable } from './UserTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useGetUsers } from '@/hooks/useUsers';
import { Users } from 'lucide-react';

const UsersPage = () => {
  const { data, isPending } = useGetUsers();

  return (
    <div className="container mx-auto py-7">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-800" />
            <h2 className="text-2xl font-bold text-gray-900">
              Users Management
            </h2>
          </div>
          <CardDescription>
            View all users, assign roles, and manage account statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Loader text="Loading..." />
          ) : (
            <UserTable data={data.users} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
