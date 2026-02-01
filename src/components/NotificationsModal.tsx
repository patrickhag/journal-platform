import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { notifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { markAllAsRead } from '@/actions/markAllAsRead';
import { headers } from 'next/headers';
import { SubmitButton } from './MarkAsReadButton';

export default async function NotificationsModal() {
  const session = await auth();
  const notificationsData = await db.query.notifications.findMany({
    where: and(
      eq(notifications.userId, session?.user?.id || ''),
      eq(notifications.isRead, false)
    ),
    limit: 7,
  });

  const hdrs = await headers();
  const currentPath = hdrs.get('x-pathname');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-7 w-7" height={36} width={36} />
          {Array.isArray(notificationsData) && notificationsData.length > 0 && (
            <span className="bg-amber-600/40 p-3 rounded-full w-3 h-3 flex justify-center items-center absolute -right-1 -top-1">
              {notificationsData.length > 7 ? '7+' : notificationsData.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      {Array.isArray(notificationsData) && notificationsData.length > 0 && (
        <DropdownMenuContent
          align="end"
          className="max-w-md border-none outline-none"
        >
          <Card className="w-[380px] shadow-none outline-none border-none">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                You have {notificationsData.length} unread messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {notificationsData.map(({ message }, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 text-muted-foreground transition-colors hover:text-gray-900"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm">{message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <MarkNotificationAsReadButton
                id={session?.user?.id as string}
                pathname={currentPath as string}
              />
            </CardFooter>
          </Card>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

const MarkNotificationAsReadButton = ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  return (
    <form action={markAllAsRead}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="pathname" value={pathname} />
      <SubmitButton />
    </form>
  );
};
