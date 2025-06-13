import { UserTable } from './UserTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { db } from '@/db/db';

const UsersPage = async () => {
  // const { data, isPending } = useGetUsers();

  const users = await db.query.users.findMany();

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
          <UserTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
