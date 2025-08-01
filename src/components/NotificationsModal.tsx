'use client';

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
import { useSession } from 'next-auth/react';
import { useGetNotifications, useMarkAsReadAll } from '@/hooks/useSettings';
import Loader from './Loader';

export default function NotificationsModal() {
  const { data } = useSession();
  const userId = data?.user.id;
  const { data: notificationsData } = useGetNotifications(
    data?.user.id as string
  );
  const { mutate, isPending } = useMarkAsReadAll();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-7 w-7" height={36} width={36} />
          {Array.isArray(notificationsData) && notificationsData.length > 0 && (
            <span className="bg-amber-600/40 p-3 rounded-full w-3 h-3 flex justify-center items-center absolute -right-1 -top-1">
              {notificationsData.length}
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
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => mutate(userId as string)}
              >
                {isPending ? <Loader text="Marking..." /> : 'Mark all as read'}
              </Button>
            </CardFooter>
          </Card>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
