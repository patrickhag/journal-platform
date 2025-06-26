'use client';

import { contributorFormSchema } from '@/schemas/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

export const Contributors = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const validation = safeParse({
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    }),
    input: new URLSearchParams(searchParams.toString()),
  });

  const contributors = validation.data?.contributors ?? [];

  const handleRemove = (email: string) => {
    const updatedContributors = contributors.filter(
      (contributor) => contributor.email !== email
    );

    const serializedData = serialize({
      data: { contributors: updatedContributors },
      schema: z.object({
        contributors: z.array(contributorFormSchema),
      }),
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete('contributors');
    router.replace(`?${params.toString()}&${serializedData.toString()}`);
  };

  return (
    <>
      {contributors.length === 0 ? (
        <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          No contributors added yet. Please add some if you have them.
        </div>
      ) : (
        <table className="w-full mt-4">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Role</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {contributors.map((c) => (
              <tr key={c.email} className="border-b">
                <td className="py-2 pr-4">{c.name}</td>
                <td className="py-2 pr-4">{c.role}</td>
                <td className="py-2 pr-4">{c.email}</td>
                <td className="py-2 pr-4">
                  <Button
                    variant="outline"
                    onClick={() => handleRemove(c.email)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
