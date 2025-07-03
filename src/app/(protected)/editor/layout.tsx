import { auth } from '@/auth';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import Protected from '@/components/Protected';

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  const userRole = session.user.role?.toLowerCase();

  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
      <div className="min-h-screen bg-gray-100">
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

            {/* Main Content */}
            <div className="ml-64 flex-1 p-8 overflow-auto">
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
        </Suspense>
      </div>
    </Protected>
  );
}
