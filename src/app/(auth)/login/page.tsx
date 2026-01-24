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
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { loginSchema } from '@/schemas/auth.schema';
import { z } from 'zod';
import { authenticate } from '@/actions/authenticate';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { resendVerificationEmail } from '@/actions/resendVerificationEmail';
import { USER_ROLES_INFO } from '@/lib/consts';

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [resendingEmail, setResendingEmail] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'NORMAL_USER',
    },
  });

  const searchparams = useSearchParams();

  useEffect(() => {
    // Show thank you message if user just verified their email
    if (searchparams.get('verified') === 'true') {
      toast.success(
        'Thank you for verifying your email! Your account has been activated. You can now log in.',
        {
          duration: 6000,
        }
      );
    }

    // Show error message whenever it exists
    if (errorMessage) {
      switch (errorMessage) {
        case 'EMAIL_NOT_VERIFIED': {
          const userEmail = form.getValues('email');
          toast.error(
            'Email not verified. Check your inbox for the verification link.',
            {
              duration: 10000,
              position: 'bottom-right',
              action: userEmail
                ? {
                    label: 'Resend',
                    onClick: async () => {
                      if (resendingEmail) return;
                      setResendingEmail(true);
                      const loadingToast = toast.loading('Sending ...', {
                        position: 'bottom-right',
                      });
                      try {
                        const result = await resendVerificationEmail(userEmail);
                        toast.dismiss(loadingToast);
                        if (result.success) {
                          toast.success(result.message, {
                            duration: 6000,
                            position: 'bottom-right',
                          });
                        } else {
                          toast.error(result.message, {
                            duration: 6000,
                            position: 'bottom-right',
                          });
                        }
                      } catch (error) {
                        toast.dismiss(loadingToast);
                        toast.error(
                          'Failed to send verification email. Please try again later.',
                          {
                            duration: 6000,
                            position: 'bottom-right',
                          }
                        );
                      } finally {
                        setResendingEmail(false);
                      }
                    },
                  }
                : undefined,
            }
          );
          break;
        }
        case 'USER_NOT_FOUND':
          toast.error(
            'No account found with this email address. Please check your email or register for a new account.',
            { duration: 6000, position: 'bottom-right' }
          );
          break;
        case 'INVALID_PASSWORD':
          toast.error(
            'Incorrect password. Please try again or use "Forgot password?" to reset it.',
            { duration: 6000, position: 'bottom-right' }
          );
          break;
        case 'INVALID_ROLE':
          toast.error(
            'You do not have permission to log in with the selected role. Please select a different role.',
            { duration: 6000, position: 'bottom-right' }
          );
          break;
        case 'PASSWORD_NOT_SET':
          toast.error(
            'Your account password is not set. Please contact support.',
            { duration: 6000, position: 'bottom-right' }
          );
          break;
        case 'MISSING_CREDENTIALS':
          toast.error('Please fill in all required fields.', {
            duration: 4000,
            position: 'bottom-right',
          });
          break;
        default:
          toast.error(errorMessage, {
            duration: 6000,
            position: 'bottom-right',
          });
      }
    }
  }, [errorMessage, searchparams, form]);

  const onSubmit = useCallback(
    (data: z.infer<typeof loginSchema>) => {
      startTransition(async () => {
        await formAction({
          ...data,
          redirect: searchparams.get('from') || undefined,
        });
      });
    },
    [formAction, searchparams]
  );

  return (
    <div>
      <Card className="max-w-3xl mx-auto p-4 mt-28">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Link href={'/'}>
              <Image
                src={'/jaep-logo.svg'}
                alt="JAEP Health Science Logo"
                width={40}
                height={40}
                className="mx-auto"
              />
            </Link>
          </div>
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Glad to see you again!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              key={errorMessage || 'default'}
            >
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select your role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {USER_ROLES_INFO.map((role) => (
                          <div
                            className="flex items-center space-x-2"
                            key={role.value}
                          >
                            <RadioGroupItem
                              value={role.value}
                              id={role.value}
                            />
                            <FormLabel
                              htmlFor={role.value}
                              className="text-sm font-normal"
                            >
                              {role.label}
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-end">
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
}
