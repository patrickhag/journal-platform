import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { auth } from '@/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>You must be logged in to view this page.</div>;
  }

  const userRole = session.user.role?.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 border-r bg-gray-50">
        <Sidebar userRole={userRole} />
      </div>

      <div className="ml-64 pt-16 min-h-screen">
        <div className="p-8">
          <div>
            <Toaster
              position="bottom-right"
              className="bg-green-200"
              richColors
            />

            {/* Suspense for lazy-loaded content */}
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                  <Loader text="Loading..." />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
