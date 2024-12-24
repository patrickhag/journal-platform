import { db, users } from '@/db/schema';
import { UserTable } from './UserTable';
const UsersPage = async () => {
  const userList = await db.select().from(users);
  return <UserTable data={userList} />;
};
export default UsersPage;
