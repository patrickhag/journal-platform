// hooks/useClearURL.ts
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useClearURL() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearURL = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('files');
    router.replace(`?${params.toString()}`);
  };

  return clearURL;
}
