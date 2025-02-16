import { db, metadata } from '@/db/schema';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReachOut } from './ReachOut';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

export default async function Reviewer({
  reviewer: { email, names, affiliation, phone, expertise, acceptedInvitation },
  index,
  article,
}: {
  reviewer: {
    id: string;
    affiliation: string;
    email: string;
    userId: string;
    names: string;
    acceptedInvitation: boolean | null;
    phone: string | null;
    expertise: string;
    articleId: string | null;
  };
  index: number;
  article: string;
}) {
  const [meta] = await db
    .select({
      title: metadata.title,
      subTitle: metadata.subtitle,
      content: metadata.abstract,
    })
    .from(metadata)
    .where(eq(metadata.articleId, article))
    .limit(1);
  const session = await auth();
  if (!session?.user?.id) return null;
  // get the user role from db

  const currentUserRole = session?.user?.role;

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
        <span className="text-center text-green-900 bg-slate-100 px-2 py-1 rounded-md">
          {typeof acceptedInvitation === 'boolean'
            ? acceptedInvitation
              ? 'Accepted'
              : 'Rejected'
            : 'Pending'}{' '}
          invitation
        </span>
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
          <p className="font-medium">{affiliation}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Phone</h4>
          <p className="font-medium">{phone}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-muted-foreground mb-2">Expertise</h4>
        <p className="text-base">{expertise}</p>
      </div>
      {(currentUserRole === 'CHIEF_EDITOR' || currentUserRole === 'ADMIN') && (
        <Popover>
          <PopoverTrigger>
            <Button variant={'outline'}>
              {' '}
              <span className="flex items-center">
                Reach out <Send className="ml-2" />
              </span>{' '}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ReachOut
              article={{ ...meta, article }}
              reviewer={names}
              author={{
                avatar: '',
                name: session.user.name,
                role: session.user.email,
              }}
              toEmail={email}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
