import { auth } from "@/auth";
import { db, users } from "@/db/schema";
import { createUpload } from "@/lib/actions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const page = async () => {
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await db.select().from(users).where(eq(users.id, session?.user?.id)).limit(1);
    if (user.length === 0) return null;

    return (
        <div className="container mx-auto">
            <form className="grid gap-3 max-w-md mx-auto my-4" action={async (form) => {
                "use server";
                if (session?.user?.id) {
                    if((form.get("files") as File)?.size > 0){
                    const { data } = await createUpload(undefined, form)
                    await db.update(users).set({ avatar: data?.url }).where(eq(users.id, session?.user?.id))

                    }
                    const formData = Object.fromEntries(form.entries());

                    await db.update(users).set({ affiliation: formData.affiliation.toString(),firstName: formData.firstName.toString(),lastName: formData.lastName.toString(),  }).where(eq(users.id, session?.user?.id))
                    revalidatePath("/profile")
                }


            }}>
                <h3 className="text-2xl font-semibold">Update Your profile</h3>
                <div className="grid grid-cols-2 gap-2">

                    <div>

                        <Label htmlFor="firstName">First Name</Label>
                        <Input name="firstName" defaultValue={user[0].firstName || undefined} />
                    </div>
                    <div>

                        <Label htmlFor="lastName">Last Name</Label>
                        <Input name="lastName" defaultValue={user[0].lastName || undefined} />
                    </div>
                </div>

                <Label htmlFor="email">Email</Label>
                <Input name="email" defaultValue={user[0].email || undefined} readOnly />

                <Label htmlFor="affiliation">Affiliation</Label>
                <Input name="affiliation" defaultValue={user[0].affiliation || undefined} />

                <div className="flex gap-3 items-center">

                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user[0].avatar || undefined} />

                        <AvatarFallback>
                            <User2 className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>

                    <Button type="button" variant='outline'><label htmlFor="files">Click to update</label></Button>
                </div>

                <input type="file" name="files" id="files" className="hidden" />
                <Button>Update profie</Button>
            </form>
        </div>
    )
}

export default page