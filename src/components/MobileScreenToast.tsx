'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const TOAST_STORAGE_KEY = 'mobile-screen-toast-shown';

export default function MobileScreenToast() {
  useEffect(() => {
    // Check if toast has been shown before (using localStorage)
    const hasShownBefore = localStorage.getItem(TOAST_STORAGE_KEY) === 'true';

    // Check if we're on mobile screen (width < 1024px which is lg breakpoint)
    const checkMobileScreen = () => {
      if (window.innerWidth < 1024 && !hasShownBefore) {
        toast.info(
          'For a better experience, we recommend using a laptop or desktop computer.',
          {
            duration: 6000,
            position: 'top-center',
          }
        );
        // Mark as shown in localStorage so it doesn't show again
        localStorage.setItem(TOAST_STORAGE_KEY, 'true');
      }
    };

    // Small delay to ensure the page is fully loaded
    const timeoutId = setTimeout(checkMobileScreen, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
