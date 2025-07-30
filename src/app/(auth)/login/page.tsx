'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { startTransition, useActionState, useCallback, useState } from 'react';
import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { loginSchema } from '@/schemas/auth.schema';
import { z } from 'zod';
import { authenticate } from '@/actions/authenticate';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { signIn } from '@/auth';
import { toast } from 'sonner';

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const searchparams = useSearchParams();

  const onSubmit = useCallback(
    (data: z.infer<typeof loginSchema>) => {
      startTransition(() => {
        formAction({
          ...data,
          redirect: searchparams.get('redirect') || undefined,
        });
      });
    },
    [formAction, searchparams]
  );

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    console.log('sddam');
    // try {
    //   await signIn('google', {
    //     callbackUrl: searchparams.get('redirect') || '/',
    //   });
    // } catch (err) {
    //   console.error('Google sign-in failed:', err);
    //   toast.info('Google sign-in failed');
    // }
  };

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto p-4 mt-24">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={'/logo.png'}
              alt="logo"
              width={40}
              height={40}
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Glad to see you again!
          </p>
          {errorMessage && (
            <div
              className="flex p-4 items-end space-x-1 justify-center bg-red-100 rounded-md"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        className="bg-blue-50 border-blue-200"
                        {...field}
                        placeholder="johndoe@gmail.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="bg-blue-50 border-blue-200 pr-10"
                          placeholder="••••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">Keep me logged in</FormLabel>
                </div>
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800"
                disabled={isPending}
              >
                {isPending ? <Loader text="Logging in..." /> : 'Login'}
              </Button>
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link href={'/register'}>
              <button className="text-blue-600 hover:underline">
                Register
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
