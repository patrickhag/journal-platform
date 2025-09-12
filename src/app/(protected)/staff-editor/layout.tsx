import Protected from '@/components/Protected';
import { type PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Protected allowedRoles={['STAFF_EDITOR']}>
      <div>{children}</div>
    </Protected>
  );
}
