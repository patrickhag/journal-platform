import { PropsWithChildren, Suspense } from 'react';
import { Toaster } from 'sonner';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <Toaster position="bottom-right" className="bg-green-200" richColors />
      {children}
    </Suspense>
  );
}
