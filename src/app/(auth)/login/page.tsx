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
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
          redirect: searchparams.get('from') || undefined,
        });
      });
    },
    [formAction, searchparams]
  );

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto p-4 mt-24">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Link href={'/'}>
              <Image
                src={'/logo.png'}
                alt="logo"
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
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="NORMAL_USER"
                            id="NORMAL_USER"
                          />
                          <FormLabel
                            htmlFor="NORMAL_USER"
                            className="text-sm font-normal"
                          >
                            Author
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="REVIEWER" id="REVIEWER" />
                          <FormLabel
                            htmlFor="REVIEWER"
                            className="text-sm font-normal"
                          >
                            Reviewer
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="ASSOCIATE_EDITOR"
                            id="ASSOCIATE_EDITOR"
                          />
                          <FormLabel
                            htmlFor="ASSOCIATE_EDITOR"
                            className="text-sm font-normal"
                          >
                            Associate Editor
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="STAFF_EDITOR"
                            id="STAFF_EDITOR"
                          />
                          <FormLabel
                            htmlFor="STAFF_EDITOR"
                            className="text-sm font-normal"
                          >
                            Staff Editor
                          </FormLabel>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="CHIEF_EDITOR"
                            id="CHIEF_EDITOR"
                          />
                          <FormLabel
                            htmlFor="CHIEF_EDITOR"
                            className="text-sm font-normal"
                          >
                            Chief Editor
                          </FormLabel>
                        </div>
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
