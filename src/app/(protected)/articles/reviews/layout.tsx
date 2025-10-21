import Protected from '@/components/Protected';
import { type PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Protected allowedRoles={['STAFF_EDITOR', 'CHIEF_EDITOR']}>
      <div>{children}</div>
    </Protected>
  );
}
