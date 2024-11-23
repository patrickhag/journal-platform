"use client"

import {
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { startTransition, useActionState, useEffect } from 'react';
import { authenticate } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';


export default function Login() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    useEffect(() => {
        if (errorMessage === 'Success') {
            router.push('/dashboard');
        }
    }, [errorMessage]);


    return <><Card className="w-full max-w-lg mx-auto p-4 mt-4">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <Image src={'/logo.png'} alt='logo' width={40} height={40} className='mx-auto' />
            </div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Glad to see you again!</p>
            {errorMessage && <div
                className="flex p-4 items-end space-x-1 justify-center bg-red-100 rounded-md"
                aria-live="polite"
                aria-atomic="true"
            >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
            }
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => {
                    startTransition(() => {
                        formAction(data)
                    })
                })}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="enter email..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="enter password..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Keep me logged in
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Button className="w-full" type="submit"
                            disabled={isPending}
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
        <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                Or continue with
            </span>
        </div>
        <CardFooter>
            <Button variant="outline" className="w-full">
                <Image src={'/Google.png'} alt="Google logo" width={20} height={20} className="mr-2" />
                Continue with Google
            </Button>
        </CardFooter>


    </Card>
        <div className="text-center mt-4 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
                Register
            </Link>
        </div>
    </>
}
