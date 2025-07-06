import Protected from '@/components/Protected';
import { type PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Protected allowedRoles={['NORMAL_USER']}>
      <div>{children}</div>
    </Protected>
  );
}
