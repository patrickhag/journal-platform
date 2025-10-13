import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorWithRedirect {
  message: string;
  redirectUrl?: string;
  errorType?: string;
}

interface UseErrorRedirectOptions {
  delay?: number;
  onRedirect?: () => void;
}

export const useErrorRedirect = (
  error: ErrorWithRedirect | undefined,
  options: UseErrorRedirectOptions = {}
) => {
  const { delay = 3000, onRedirect } = options;
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!error?.redirectUrl) {
      setCountdown(null);
      return;
    }

    setCountdown(delay / 1000);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onRedirect?.();
          router.push(error.redirectUrl!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      setCountdown(null);
    };
  }, [error?.redirectUrl, delay, onRedirect, router]);

  return {
    countdown,
    isRedirecting: countdown !== null,
  };
};
