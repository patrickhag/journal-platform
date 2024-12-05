"use client";

import { reachOut } from "@/lib/actions";
import { FC, useActionState } from "react";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export const ReachOut:FC<{names: string, email: string}> = ({email, names}) => {
    const [errorMessage, formAction, isPending] = useActionState(
		reachOut,
		undefined,
	);
  return (
    <form className='grid gap-3' action={formAction}>
        {errorMessage && <p className="text-green-500">{errorMessage}</p>}
    <h3>Send a message to {names}</h3>
    <input type="hidden" name="email" id="email" value={email} readOnly/>
    <input type="hidden" name="name" id="name" value={names} readOnly/>
    <Textarea placeholder="Message" name='message'/>
    <Button className="mt-2">Send { isPending && <Spinner/>}</Button>
  </form>
  )
}
