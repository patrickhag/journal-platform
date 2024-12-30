import { db, users } from '@/db/schema';
import { UsersTable } from './UserTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const UsersPage = async () => {
  const userList = await db.select().from(users);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          <CardDescription>
            Manage users and get to deactivate accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            data={userList}
            role="CHIEF_EDITOR"
            requiredPermissions={['PUBLISH_ARTICLES']}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default UsersPage;
