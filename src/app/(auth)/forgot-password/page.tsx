"use client"

import {
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function Login() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    const router = useRouter();

    const handleSuccess = () => {
        // router.push('/dashboard');
    };

    return <Card className="w-full max-w-lg mx-auto p-4 mt-4">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <Image src={'/logo.png'} alt='logo' width={40} height={40} className='mx-auto' />
            </div>
            <h2 className="text-2xl font-semibold">Request password reset</h2>
            <p className="text-sm text-muted-foreground">!</p>
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
            <form action={formAction}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="enter email..."
                            type="email"
                            name="email"
                            required
                        />
                    </div>
                 
                    <Button className="w-full" type="submit" onClick={handleSuccess} aria-disabled={isPending}>
                        Reset password
                    </Button>
                </div>
            </form>
        </CardContent>
       
        <div className="text-center mt-4 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
                Register
            </Link>
        </div>
    </Card>
}