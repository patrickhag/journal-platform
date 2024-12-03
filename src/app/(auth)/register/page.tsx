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
import { register } from '@/lib/actions';
import { COUNTRIES } from '@/lib/consts';
import { registerSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Loader from '@/components/Loader';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export default function Register() {
  const [prevState, formAction, isPending] = useActionState(
    register,
    undefined
  );
  const router = useRouter();

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
    if (prevState?.message === 'Registration successful') {
      router.push('/login');
    }
  }, [prevState?.message]);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto border-gray-200 shadow-md p-2 mt-32">
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
                        <Select defaultValue="Rwanda" {...field}>
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
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Use at least 8 characters."
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
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password..."
                          {...field}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </FormControl>
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
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          ></div>
        </CardContent>
      </Card>
      <div className="text-center my-16 text-lg text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </>
  );
}
