import Protected from '@/components/Protected';
import { type PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Protected allowedRoles={['ASSOCIATE_EDITOR']}>
      <div>{children}</div>
    </Protected>
  );
}
