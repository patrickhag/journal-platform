import { BASE_PATH, auth } from '@/auth';
import Header from '@/components/Header';
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header />
      <div className="flex bg-gray-100 min-h-screen">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
