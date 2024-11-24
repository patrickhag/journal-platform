import {  useSearchParams } from "next/navigation"
import { Checkbox } from "./ui/checkbox"
import { safeParse } from "zod-urlsearchparams"
import { z } from "zod"
import { contributorFormSchema } from "@/schemas/upload"

export const Contributors = () => {
    const searchParams = useSearchParams()
    const validation = safeParse({
        schema: z.object({
            contributors: z.array(contributorFormSchema),
        }),
        input: new URLSearchParams(searchParams.toString()),
    })
    return (
        <table className="w-full">
            <thead>
                <tr className="border-b text-left">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Primary contact</th>
                </tr>
            </thead>
            <tbody>
                {validation.data?.contributors.map((c) => (
                    <tr key={c.homepage + c.name} className="border-b">
                        <td className="py-2 pr-4">{c.name}</td>
                        <td className="py-2 pr-4">{c.homepage}</td>
                        <td className="py-2 pr-4">{c.role}</td>
                        <td className="py-2 pr-4">
                            <Checkbox id={`primary-${c.name}`} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
