"use client"

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
//   import { button } from '@/app/ui/button';
import React, { InputHTMLAttributes, useActionState } from 'react';
import { register } from '@/lib/actions';
import { COUNTRIES } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/Input';


export default function Regitser() {

    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined,
    );

    return <form action={formAction} className="space-y-3 max-w-lg mx-auto my-5 ring-2 rounded-sm ring-gray-400/15">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <Image src={'/logo.png'} alt='logo' width={40} height={40} className='mx-auto'/>
            <h1 className={`mb-3 text-2xl text-center`}>
                Sign up
            </h1>
            <p className='text-center'>
                Register and get to login
            </p>
            <div className="w-full">
                <Input label='FistName' placeholder='Enter your FistName name' type='text' />
                <Input label='LastName' placeholder='Enter your LastName name' type='text' />
                <Input label='Affiliation' placeholder='enter institution, college, company, independent researcher...' type='text' />
                <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="country"
                >Country</label>
                <select name="country" id="country"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                >

                    {COUNTRIES.map(c => <option value={c} key={c} selected={c == 'Rwanda'}>{c}</option>)}
                </select>
                <Input label='Email' placeholder='Enter your Email here' type='email' />
                <Input label='Password' placeholder='Enter your Password' type='password' />
                <Input label='Confirm Password' placeholder='Enter your Confirm Password' type='password' />


                <div className="mt-4">
                    <input
                        type="checkbox" name="accept" id="accept" /> <label htmlFor="accept">I agree to the Terms and Conditions and Privacy Policy</label>

                </div>
            </div>
            <Button className="mt-4 flex w-full bg-blue-800" aria-disabled={isPending}>
                Register
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
            <div className='text-center mx-auto'>

            <Link href={'/login'}><span className='text-gray-500'>Already have an account?</span> Login</Link>
            </div>
        </div>
    </form>
}

