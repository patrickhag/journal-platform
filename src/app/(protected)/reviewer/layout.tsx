import { BASE_PATH, auth } from '@/auth';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import Protected from '@/components/Protected';
import { SessionProvider } from 'next-auth/react';
import { Suspense, type PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar'; // Adjust path

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  const userRole = session.user.role?.toLowerCase();

  return (
    <Protected allowedRoles={['REVIEWER']}>
      <SessionProvider basePath={BASE_PATH} session={session}>
        <Header />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
              <Loader text="Loading..." />
            </div>
          }
        >
          <div className="flex min-h-screen">
            <div className="fixed top-16 h-[calc(100vh-4rem)] left-0 w-64 z-10">
              <Sidebar userRole={userRole} />
            </div>
            <div className="ml-64 flex-1 overflow-auto p-8">
              <div className="max-w-5xl mx-auto">{children}</div>
            </div>
          </div>
        </Suspense>
      </SessionProvider>
    </Protected>
  );
}
