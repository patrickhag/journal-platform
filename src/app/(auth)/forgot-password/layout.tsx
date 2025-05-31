'use client';

import type React from 'react';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

const Layout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <Suspense>
      <Toaster position="bottom-right" className="bg-green-200" richColors />
      {children}
    </Suspense>
  );
};

export default Layout;
