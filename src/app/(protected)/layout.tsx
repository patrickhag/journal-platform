import { auth, BASE_PATH } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
    const session = await auth();
    if (session && session.user) {
        session.user = {
            name: session.user.name,
            email: session.user.email,
        };
    }
   return <SessionProvider basePath={BASE_PATH} session={session}>
        {children}
    </SessionProvider>
}