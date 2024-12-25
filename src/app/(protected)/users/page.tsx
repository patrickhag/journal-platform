import { db, users } from '@/db/schema';
import { UsersTable } from './UserTable';
const UsersPage = async () => {
  const userList = await db.select().from(users);
  return (
    <UsersTable
      data={userList}
      role="CHIEF_EDITOR"
      requiredPermissions={['MANAGE_USERS']}
    />
  );
};
export default UsersPage;
