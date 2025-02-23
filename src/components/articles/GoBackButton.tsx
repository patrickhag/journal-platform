'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GoBackButton() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        onClick={() =>
          session.data?.user?.role === 'ADMIN' ||
          session.data?.user?.role === 'CHIEF_EDITOR'
            ? router.push('/editor/articles')
            : router.push('/submissions')
        }
      >
        <ChevronLeft className="w-4 h-4" />
        Back to dashboard
      </Button>
    </div>
  );
}
