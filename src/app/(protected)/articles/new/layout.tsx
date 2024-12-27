import { ProgressLine } from '@/components/upload/Progress';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ProgressLine />
      <div className="container">{children}</div>
    </>
  );
}
