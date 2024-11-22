"use client"
import { signIn, signOut } from "@/auth/helpers";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const session = useSession();
    return session?.data?.user ? (
      <Button
        onClick={async () => {
          await signOut();
        }}
      >
        {session.data?.user.email} : Sign Out
      </Button>
    ) : (
      <Button onClick={async () => await signIn()}>Sign In</Button>
    );
}