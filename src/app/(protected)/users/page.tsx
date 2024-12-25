import { db, users } from '@/db/schema';
import { UsersTable } from './UserTable';
const UsersPage = async () => {
  const userList = await db.select().from(users);
  // TODO: big fix
  return (
    <UsersTable
      data={userList}
      role="CHIEF_EDITOR"
      requiredPermissions={['PUBLISH_ARTICLES']}
    />
  );
};
export default UsersPage;
