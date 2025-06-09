import { auth } from '@/auth';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
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

  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
              <Loader text="Loading..." />
            </div>
          }
        >
          <main className="container mx-auto py-7">
            <Toaster
              position="bottom-right"
              className="bg-green-200"
              richColors
            />
            {children}
          </main>
        </Suspense>
      </div>
    </Protected>
  );
}
