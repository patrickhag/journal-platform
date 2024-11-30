import { BASE_PATH, auth } from "@/auth";
import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
    };
  }
  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="container">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
