'use client';

import { Edit2, Trash2, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { type FC, useState } from 'react';
import { z } from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { Button } from './ui/button';
import { contributorFormSchema } from '@/schemas/upload';
import UpdateContributorModal from './UpdateContributor';

export const Contributor: FC<z.infer<typeof contributorFormSchema>> = ({
  salutation,
  name,
  affiliation,
  email,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-3">
      <User className="w-5 h-5" />
      <div className="flex-1">
        <h4 className="font-medium">{`${salutation}. ${name}`}</h4>
        <p className="text-sm text-muted-foreground">{affiliation}</p>
      </div>
      <div className="flex items-center gap-2">
        <UpdateContributorModal
          email={email}
          onOpenChange={(open) => {
            setOpen(open);
          }}
          open={open}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleRemove(email)}>
          <Trash2 className="w-4 h-4" />
        </Button>
        <span className="bg-muted px-2 py-1 rounded text-sm">Contributor</span>
      </div>
    </div>
  );
};
