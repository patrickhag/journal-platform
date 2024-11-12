"use client"

import {
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import React, { useActionState } from 'react';
import { register } from '@/lib/actions';
import { COUNTRIES } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function Regitser() {

    const [prevState, formAction, isPending] = useActionState(
        register,
        undefined,
    );
    const router = useRouter();
    const handleSuccess = () => {
        if (prevState?.message === 'Registration successful') {
            router.push('/login')
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto bg-[#F8F8F8] border-gray-200 shadow-md">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <Image src={'/logo.png'} alt='logo' width={40} height={40} className='mx-auto' />
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">Sign up</h2>
                <p className="text-sm text-gray-600">Register and get to login</p>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstname" className="text-sm text-gray-700">
                            Firstname *
                        </Label>

                        <Input
                            id="firstname"
                            name="firstName"
                            placeholder="enter firstname..."
                            required
                            defaultValue={prevState?.data?.firstName}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname" className="text-sm text-gray-700">
                            Lastname *
                        </Label>

                        <Input
                            id="lastname"
                            name="lastName"
                            placeholder="enter lastname..."
                            required
                            defaultValue={prevState?.data?.lastName}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="affiliation" className="text-sm text-gray-700">
                            Affiliation *
                        </Label>

                        <Input
                            id="affiliation"
                            name="affiliation"
                            defaultValue={prevState?.data?.affiliation}
                            placeholder="enter institution, college, company, independent researcher..."
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm text-gray-700">
                            Country *
                        </Label>

                        <Select
                            defaultValue='Rwanda'
                            name='country'
                        >
                            <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                                <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                            {COUNTRIES.map(c => 
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            )}
                            </SelectContent>


                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-gray-700">
                            Email *
                        </Label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="enter your email..."
                            required
                            defaultValue={prevState?.data?.email}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm text-gray-700">
                            Password *
                        </Label>


                        <Input
                            id="password"
                            name="password"
                            defaultValue={prevState?.data?.password}
                            type="password"
                            placeholder="enter your password..."
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ConfirmPassword" className="text-sm text-gray-700">
                            Confirm Password *
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="ConfirmPassword"
                            type="password"
                            placeholder="confirm your password..."
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-700 leading-none"
                        >
                            I agree to the{" "}
                            <Link href="/terms" className="text-gray-800 hover:underline">
                                Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-gray-800 hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    <Button onClick={handleSuccess} className="w-full bg-gray-800 hover:bg-gray-700 text-white" type="submit" aria-disabled={isPending}>
                        Register
                    </Button>
                </form>

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
    )
}

