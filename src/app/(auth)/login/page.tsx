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
import RoleSelector from '@/components/RoleSelector';
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { loginSchema } from '@/schemas/auth.schema';
import { z } from 'zod';
import { authenticate } from '@/actions/authenticate';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Link from 'next/link';

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [visible, setVisible] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: '',
    },
  });

  useEffect(() => {
    if (errorMessage) {
      setVisible(errorMessage);
    }
    const timeout = setTimeout(() => {
      setVisible(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const searchparams = useSearchParams();

  const onSubmit = useCallback(
    (data: z.infer<typeof loginSchema>) => {
      startTransition(() => {
        setVisible(null);
        formAction({
          ...data,
          redirect: searchparams.get('redirect') || undefined,
        });
      });
    },
    [formAction, searchparams]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
          {visible && (
            <div
              className="flex p-4 items-end space-x-1 justify-center bg-red-100 rounded-md"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{visible}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <RoleSelector
                      selectedRole={field.value}
                      onRoleSelect={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

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
};

export default LoginComponent;
