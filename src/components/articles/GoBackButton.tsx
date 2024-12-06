'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GoBackButton() {
  const router = useRouter();
  return (
    <div className="mb-4">
      <Button variant="outline" onClick={() => router.back()}>
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
    </div>
  );
}
