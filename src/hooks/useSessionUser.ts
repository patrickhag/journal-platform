import { getUser } from '@/auth/createSession';
import useSWR from 'swr';

const fetchUser = () => getUser();

export function useUserSession() {
  const { data: user, error, isLoading } = useSWR('user', fetchUser);

  return {
    user,
    loading: isLoading,
    error,
  };
}
