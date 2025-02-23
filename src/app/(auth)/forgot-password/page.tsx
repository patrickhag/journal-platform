'use client';

import { resetPassword } from '@/actions/resetPassword';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { EyeClosedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

const initialState = {
  message: '',
  success: false,
};

export default function Login() {
  const [prevMessage, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<string>('password');

  const params = useSearchParams();

  useEffect(() => {
    if (params.get('msg') || prevMessage?.message) {
      setVisible(true);
    }
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [prevMessage, params]);

  return (
    <Card className="w-full max-w-lg mx-auto p-4 mt-32">
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
        <h2 className="text-2xl font-semibold">Reset your password</h2>

        {visible && (
          <div
            className={`flex p-4 items-end space-x-1 justify-center rounded-md ${
              prevMessage?.success ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {prevMessage?.success ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-sm ${
                prevMessage?.success === true
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {params.get('msg') || prevMessage?.message}
            </p>
          </div>
        )}
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
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="enter new password..."
                  type={passwordType}
                  name="password"
                  required
                />
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
                    <EyeIcon width={18} height={18} className="text-gray-600" />
                  ) : (
                    <EyeClosedIcon
                      width={18}
                      height={24}
                      className="text-gray-600"
                    />
                  )}
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <Loader text="Resetting password..." />
              ) : (
                'Sending reset link'
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <div className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </Card>
  );
}
