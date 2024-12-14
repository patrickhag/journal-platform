import { auth } from '@/auth';
import { db, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { createUpload } from '@/actions/createUpload';

const page = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);
  if (user.length === 0) return null;

  return (
    <Card className="max-w-5xl mx-auto">
      <div>
        <form
          className="p-5"
          action={async (form) => {
            'use server';
            if (session?.user?.id) {
              if ((form.get('files') as File)?.size > 0) {
                const { data } = await createUpload(undefined, form);
                await db
                  .update(users)
                  .set({ avatar: data?.url })
                  .where(eq(users.id, session?.user?.id));
              }
              const formData = Object.fromEntries(form.entries());

              await db
                .update(users)
                .set({
                  affiliation: formData.affiliation.toString(),
                  firstName: formData.firstName.toString(),
                  lastName: formData.lastName.toString(),
                })
                .where(eq(users.id, session?.user?.id));
              revalidatePath('/profile');
            }
          }}
        >
          <h3 className="text-2xl font-semibold">Update Your profile</h3>
          <div className="my-3">
            <div>
              <Label htmlFor="firstName" className="text-gray-500">
                First Name
              </Label>
              <Input
                name="firstName"
                defaultValue={user[0].firstName || undefined}
              />
            </div>
            <div className="my-3">
              <Label htmlFor="lastName" className="text-gray-500">
                Last Name
              </Label>
              <Input
                name="lastName"
                defaultValue={user[0].lastName || undefined}
              />
            </div>
          </div>
          <div className="my-3">
            <Label htmlFor="email" className="text-gray-500">
              Email
            </Label>
            <Input
              name="email"
              defaultValue={user[0].email || undefined}
              readOnly
            />
          </div>
          <div className="my-3">
            <Label htmlFor="affiliation" className="text-gray-500">
              Affiliation
            </Label>
            <Input
              name="affiliation"
              defaultValue={user[0].affiliation || undefined}
            />
          </div>
          <div className="flex gap-3 items-center my-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user[0].avatar || undefined} />

              <AvatarFallback>
                <User2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <Button type="button" variant="outline">
              <label htmlFor="files">Choose an image</label>
            </Button>
          </div>

          <input type="file" name="files" id="files" className="hidden" />
          <Button>Update profie</Button>
        </form>
      </div>
    </Card>
  );
};

export default page;
