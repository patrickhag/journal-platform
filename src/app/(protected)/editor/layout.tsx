import { auth } from '@/auth';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { Suspense } from 'react';

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
            <Loader text="Loading..." />
          </div>
        }
      >
        <main>{children}</main>
      </Suspense>
    </div>
  );
}
