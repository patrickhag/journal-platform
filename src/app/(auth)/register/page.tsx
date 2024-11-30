"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/lib/actions";
import { COUNTRIES } from "@/lib/consts";
import { registerSchema } from "@/schemas/auth.schema";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function Register() {
  const [prevState, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      country: "Rwanda",
      lastName: "",
      firstName: "",
      affiliation: "",
      acceptTerms: false,
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (prevState?.message === "Registration successful") {
      router.push("/login");
    }
  }, [prevState?.message]);

  return (
    <Card className="w-full max-w-lg mx-auto  border-gray-200 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src={"/logo.png"}
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
            className="space-y-4"
          >
            <div className="space-y-2">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="firstName"
                      className="text-sm text-gray-700"
                    >
                      Firstname *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter firstname..."
                        {...field}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="lastName"
                      className="text-sm text-gray-700"
                    >
                      Lastname *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter lastname..."
                        {...field}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="affiliation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="affiliation"
                      className="text-sm text-gray-700"
                    >
                      Affiliation *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter institution, college, company, independent researcher..."
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="country"
                      className="text-sm text-gray-700"
                    >
                      Country *
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
            <div className="space-y-2">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="text-sm text-gray-700"
                    >
                      Email *
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
            <div className="space-y-2">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="text-sm text-gray-700"
                    >
                      Password *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="enter your password..."
                        {...field}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="confirmPassword"
                      className="text-sm text-gray-700"
                    >
                      Confirm Password *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="confirm your password..."
                        {...field}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
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
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-gray-800 hover:underline"
                          >
                            Terms and Conditions
                          </Link>{" "}
                          and{" "}
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
              type="submit"
              aria-disabled={isPending}
            >
              Register
            </Button>
          </form>
        </Form>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {prevState?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{prevState?.message}</p>
            </>
          )}
        </div>
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-800 hover:underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
