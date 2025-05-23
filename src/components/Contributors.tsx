'use client';
import { contributorFormSchema } from '@/schemas/upload';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { Button } from './ui/button';

export const Contributors = () => {
  const searchParams = useSearchParams();
  const validation = safeParse({
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    }),
    input: new URLSearchParams(searchParams.toString()),
  });
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b text-left">
          <th className="pb-2 pr-4">Name</th>
          <th className="pb-2 pr-4">Role</th>
          <th className="pb-2 pr-4">Email</th>
          <th className="pb-2 pr-4" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{session?.user?.name}</td>
          <td>Author</td>
          <td>{session?.user?.email}</td>
          <td></td>
          <td></td>
        </tr>
        {validation.data?.contributors.map((c) => (
          <tr key={c.name + c.email} className="border-b">
            <td className="py-2 pr-4">{c.name}</td>
            <td className="py-2 pr-4">{c.role}</td>
            <td className="py-2 pr-4">{c.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
