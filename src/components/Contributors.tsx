'use client';

import { contributorFormSchema } from '@/schemas/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Contributor } from './Contributor';

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
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          No contributors added yet. Please add some if you have them.
        </div>
      ) : (
        <>
          {contributors.map((c) => (
            <Contributor key={c.email} {...c} />
          ))}
        </>
      )}
    </>
  );
};
