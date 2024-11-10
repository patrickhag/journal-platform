"use client"

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import Image from 'next/image';
import { Input } from '@/components/Input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function Login() {

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return <form action={formAction} className="space-y-3 max-w-lg mx-auto my-5 ring-2 rounded-sm ring-gray-400/15">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <Image src={'/logo.png'} alt='logo' width={40} height={40} className='mx-auto' />
            <h1 className={`mb-3 text-2xl text-center`}>
                Welcome back
            </h1>
            <p className='text-center'>
                Glad to see you again!
            </p>
            <div className="w-full">
                <Input label='Email' placeholder='Enter your Email here' type='email' />
                <Input label='Password' placeholder='Enter your Password' type='password' />
                <div className="mt-4 flex justify-between">
                    <p>

                        <input
                            type="checkbox" name="accept" id="accept" /> <label htmlFor="accept">Keep me logged in</label>
                    </p>
                    <Link href={'/reset'}>Forgot password?</Link>
                </div>
            </div>

            <Button className="mt-4 flex w-full bg-blue-800" aria-disabled={isPending}>
                Login
                {/* <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /> */}
            </Button>
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
            <div>

                <div className='flex items-center gap-3'>
                    <hr className='flex-1' />
                    <p className='text-gray-500'>Or continue with</p>
                    <hr className='flex-1' />
                </div>
                <Button className="my-4 flex w-full bg-white text-black" aria-disabled={isPending}>
                    <Image src={'/Google.png'} width={20} height={20} alt='Continue with Google' />
                    <p>
                        Continue with Google
                    </p>
                </Button>
            </div>
            <div className='text-center mx-auto'>

                <Link href={'/register'}><span className='text-gray-500'>Don’t have an account yet?</span> Register</Link>
            </div>
        </div>
    </form>
}