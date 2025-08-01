import { signIn } from '@/auth';

export async function doSocialLogin() {
  await signIn('google', { redirectTo: '/submissions' });
}
