import { db, passwordResets, users } from "@/db/schema";
import { RESET_PASSWORD_EXPIRATION_TIME } from "@/lib/consts";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get("id")
  if (!token)
    redirect('/login')
  const data = await db.select().from(passwordResets).where(eq(passwordResets.token, token)).limit(1).execute()
  const userRequest = data[0]
  const expirationTime = userRequest.expires.getTime()
  if (expirationTime < (Date.now() - RESET_PASSWORD_EXPIRATION_TIME)) {
    return redirect('/forgot-password?msg=token has exired please request again')
  }

  await db.update(users).set({ password: userRequest.password }).execute()
  return redirect('/login')
};
