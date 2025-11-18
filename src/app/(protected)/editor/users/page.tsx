import { UserTable } from './UserTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { db } from '@/db/db';

const UsersPage = async () => {
  const users = await db.query.userRoles
    .findMany({
      columns: {
        role: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            affiliation: true,
            createdAt: true,
            isPartOfEditorialBoard: true,
          },
        },
      },
    })
    .then((userRoles) =>
      userRoles.map((userRole) => ({
        ...userRole.user,
        role: userRole.role,
      }))
    );

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
