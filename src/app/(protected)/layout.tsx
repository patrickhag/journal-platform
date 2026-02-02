import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ProtectedLayoutClient from '@/components/ProtectedLayoutClient';
import MobileScreenToast from '@/components/MobileScreenToast';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { auth } from '@/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  const userRole = session?.user.role?.toLowerCase() || '';

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        <ProtectedLayoutClient sidebar={<Sidebar userRole={userRole} />}>
          <div>
            <MobileScreenToast />
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
        </ProtectedLayoutClient>
      </div>
    </SidebarProvider>
  );
}
