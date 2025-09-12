'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function InvitationToast({
  isAccepted,
}: {
  isAccepted: boolean | undefined;
}) {
  const router = useRouter();

  useEffect(() => {
    if (isAccepted === undefined) return;

    const toastKey = 'invitation-toast-shown';

    const alreadyShown = sessionStorage.getItem(toastKey);
    if (alreadyShown) {
      router.replace(window.location.pathname);
      return;
    }

    if (isAccepted) {
      toast.success(
        'Thank you for accepting the invitation of editing and formatting the manuscript'
      );
    } else {
      toast.info('Thank you for letting us know!');
    }

    sessionStorage.setItem(toastKey, 'true');

    const timeout = setTimeout(() => {
      router.replace(window.location.pathname);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isAccepted, router]);

  return null;
}
