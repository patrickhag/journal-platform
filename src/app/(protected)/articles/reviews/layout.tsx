import Protected from '@/components/Protected';
import { TooltipProvider } from '@/components/ui/tooltip';
import { type PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Protected allowedRoles={['STAFF_EDITOR', 'CHIEF_EDITOR']}>
      <TooltipProvider>
        <div>{children}</div>
      </TooltipProvider>
    </Protected>
  );
}
