'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/lib/consts';
import { registerSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Loader from '@/components/Loader';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { register } from '@/actions/register';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [prevState, formAction, isPending] = useActionState(
    register,
    undefined
  );

  const router = useRouter();
  const [visible, setVisible] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      country: 'Rwanda',
      lastName: '',
      firstName: '',
      affiliation: '',
      acceptTerms: false,
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (prevState?.message == 'Registration successful') {
      router.replace('/login');
    }
    if (prevState?.message == 'Email already in use.') {
      setVisible(prevState.message);
    }
    const timeout = setTimeout(() => {
      setVisible(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [prevState?.message]);

  const [passwordType, setPasswordType] = useState<'password' | 'text'>(
    'password'
  );
  return (
    <>
      <Card className="w-full max-w-2xl mx-auto border-gray-200 shadow-md p-2 my-24">
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
          <h2 className="text-3xl font-semibold text-gray-800">Sign up</h2>
          <p className="text-sm text-gray-600">Register and get to login</p>
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
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                startTransition(() => {
                  formAction(data);
                });
              })}
            >
              <div className="my-4">
                <FormField
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="firstName"
                        className="text-sm text-gray-700"
                      >
                        Firstname <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter firstname..."
                          {...field}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="lastName"
                        className="text-sm text-gray-700"
                      >
                        Lastname <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter lastname..."
                          {...field}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  name="affiliation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="affiliation"
                        className="text-sm text-gray-700"
                      >
                        Affiliation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter an institution, college, company, independent researcher..."
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="country"
                        className="text-sm text-gray-700"
                      >
                        Country <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="email"
                        className="text-sm text-gray-700"
                      >
                        Email <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="enter your email..."
                          {...field}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="password"
                        className="text-sm text-gray-700"
                      >
                        Password <span className="text-red-700">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={passwordType}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            placeholder="Use at least 8 characters."
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="-translate-x-2 absolute right-0 top-[50%] -translate-y-[50%]"
                          onClick={() =>
                            setPasswordType(
                              passwordType === 'password' ? 'text' : 'password'
                            )
                          }
                        >
                          {passwordType === 'password' ? (
                            <EyeIcon
                              width={18}
                              height={18}
                              className="text-gray-600"
                            />
                          ) : (
                            <EyeClosedIcon
                              width={18}
                              height={24}
                              className="text-gray-600"
                            />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-4">
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="confirmPassword"
                        className="text-sm text-gray-700"
                      >
                        Confirm Password <span className="text-red-700">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={passwordType}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            placeholder="Confirm your password..."
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="-translate-x-2 absolute right-0 top-[50%] -translate-y-[50%]"
                          onClick={() =>
                            setPasswordType(
                              passwordType === 'password' ? 'text' : 'password'
                            )
                          }
                        >
                          {passwordType === 'password' ? (
                            <EyeIcon
                              width={18}
                              height={18}
                              className="text-gray-600"
                            />
                          ) : (
                            <EyeClosedIcon
                              width={18}
                              height={24}
                              className="text-gray-600"
                            />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-7">
                <FormField
                  name="acceptTerms"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            value={undefined}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm text-gray-700 leading-none"
                          >
                            I agree to the{' '}
                            <Link
                              href="/terms"
                              className="text-gray-800 hover:underline"
                            >
                              Terms and Conditions
                            </Link>{' '}
                            and{' '}
                            <Link
                              href="/privacy"
                              className="text-gray-800 hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                disabled={isPending}
              >
                {isPending ? <Loader text="Registering..." /> : 'Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center text-sm my-3">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </Card>
    </>
  );
}
