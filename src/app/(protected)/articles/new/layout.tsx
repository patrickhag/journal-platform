import { auth } from "@/auth";
import { ProgressLine } from "@/components/upload/Progress";
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
    <>
      <ProgressLine />
      <div className="container">{children}</div>
    </>
  );
}
