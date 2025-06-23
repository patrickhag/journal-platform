import { BASE_PATH, auth } from '@/auth';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { SessionProvider } from 'next-auth/react';
import { Suspense, type PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
            <Loader text="Loading..." />
          </div>
        }
      >
        <div className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto p-5">
            <Toaster
              position="bottom-right"
              className="bg-green-200"
              richColors
            />
            {children}
          </div>
        </div>
      </Suspense>
    </SessionProvider>
  );
}
