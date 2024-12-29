import { db, users } from '@/db/schema';
import { UsersTable } from './UserTable';
import { Card, CardContent } from '@/components/ui/card';
const UsersPage = async () => {
  const userList = await db.select().from(users);
  return (
    <Card className="mt-8 border-none shadow-none">
      <CardContent className="border-none">
        <UsersTable
          data={userList}
          role="CHIEF_EDITOR"
          requiredPermissions={['MANAGE_USERS']}
        />
      </CardContent>
    </Card>
  );
};
export default UsersPage;
