'use client';

import { useResetPassword } from '@/hooks/useResetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, Eye, EyeClosedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Loader from '@/components/Loader';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [passwordType, setPasswordType] = useState<'password' | 'text'>(
    'password'
  );

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const params = useSearchParams();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    resetPassword(data);
  };

  useEffect(() => {
    const msg = params.get('msg');
    if (msg) {
      setMessage({ text: msg, success: false });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  }, [params]);

  return (
    <Card className="w-full max-w-lg mx-auto p-4 mt-32">
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
        <h2 className="text-2xl font-semibold">Reset your password</h2>
        {showMessage && message && (
          <div
            className={`flex p-4 items-end space-x-1 justify-center rounded-md ${
              message.success ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {message.success ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-sm ${message.success ? 'text-green-500' : 'text-red-500'}`}
            >
              {message.text}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter new password"
                        type={passwordType}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setPasswordType(
                            passwordType === 'password' ? 'text' : 'password'
                          )
                        }
                      >
                        {passwordType === 'password' ? (
                          <Eye size={20} />
                        ) : (
                          <EyeClosedIcon size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <Loader text="Resetting password..." />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="text-center mt-4 text-sm">
        Remember your password?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </Card>
  );
}
