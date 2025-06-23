import { BASE_PATH, auth } from '@/auth';
import Header from '@/components/Header';
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header />
      <div className="flex min-h-screen">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Toaster
              position="bottom-right"
              className="bg-green-200"
              richColors
            />
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
