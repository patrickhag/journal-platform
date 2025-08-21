import { auth } from '@/auth';
import Protected from '@/components/Protected';
import { ProgressLine } from '@/components/upload/Progress';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return;

  return (
    <Protected allowedRoles={['NORMAL_USER']}>
      <div className="min-h-screen bg-gray-100">
        <ProgressLine />
        <div className="p-6">{children}</div>
      </div>
    </Protected>
  );
}
