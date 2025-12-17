'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ReviewerInvitationToast({
  status,
  redirectTo,
}: {
  status:
    | 'already-accepted'
    | 'already-declined'
    | 'accepted'
    | 'declined'
    | undefined;
  redirectTo?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (status === undefined) return;

    const toastKey = `reviewer-invitation-toast-${status}`;

    const alreadyShown = sessionStorage.getItem(toastKey);
    if (alreadyShown) {
      router.replace(redirectTo || '/reviewer/assignments');
      return;
    }

    switch (status) {
      case 'already-accepted':
        toast.info('You have already accepted this invitation.');
        break;
      case 'already-declined':
        toast.info('You have already declined this invitation.');
        break;
      case 'accepted':
        toast.success('Thank you for accepting the invitation!');
        break;
      case 'declined':
        toast.info(
          'Thank you for letting us know. We appreciate your response.'
        );
        break;
    }

    sessionStorage.setItem(toastKey, 'true');

    const timeout = setTimeout(() => {
      router.replace(redirectTo || '/reviewer/assignments');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [status, router, redirectTo]);

  return null;
}
