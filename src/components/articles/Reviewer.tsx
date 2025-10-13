'use client';

import { ReachOut } from './ReachOut';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Reviewer({
  reviewer: { email, names, affiliation, phone, expertise },
  index,
}: {
  reviewer: {
    affiliation: string;
    email: string;
    names: string;
    phone: string | null;
    expertise: string;
    articleId: string | null;
  };
  index: number;
  articleId: string;
}) {
  const { data } = useSession();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const reviewerStatus = 'Sent';

  const currentUserRole = data?.user?.role;

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {index + 1}
          <sup>
            {index === 0
              ? 'st'
              : index === 1
                ? 'nd'
                : index === 2
                  ? 'rd'
                  : 'th'}
          </sup>{' '}
          proposed reviewer{' '}
        </h3>
        <Badge
          variant={'outline'}
          className={`text-center px-2 py-1 rounded-md`}
        >
          Invitation {reviewerStatus}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Fullnames</h4>
          <p className="font-medium">{names}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Email</h4>
          <p className="font-medium">{email}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Affiliation</h4>
          <p className="font-medium">
            {affiliation ? affiliation : 'Not provided'}
          </p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Phone</h4>
          <p className="font-medium">{phone ? phone : 'Not provided'}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-muted-foreground mb-2">Expertise</h4>
        <p className="text-base">{expertise}</p>
      </div>
      {(currentUserRole === 'CHIEF_EDITOR' ||
        currentUserRole === 'STAFF_EDITOR') && (
        <Button variant={'outline'} onClick={() => setDialogOpen(true)}>
          {' '}
          <span className="flex items-center">
            Reach out <Send className="ml-2" />
          </span>{' '}
        </Button>
      )}
      <ReachOut
        open={isDialogOpen}
        setOpen={setDialogOpen}
        reviewerNames={names}
        toEmail={email}
      />
    </>
  );
}
