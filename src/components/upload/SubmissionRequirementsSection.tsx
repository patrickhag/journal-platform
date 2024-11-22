import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import { requirementsCheckboxGroup } from "@/lib/consts"
import { serialize, safeParse } from "zod-urlsearchparams";
import { z } from "zod";

export const SubmissionRequirementsSection = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const requirementsSchema = z.object({ requirements: z.array(z.string()) })

    const requirementsValidation = safeParse({
        schema: requirementsSchema,
        input: new URLSearchParams(searchParams.toString()),
        defaultData: { requirements: [] }
    })

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Submission requirements
            </h2>
            <p className="text-gray-600 mb-4">
                You must read and acknowledge that you&apos;ve completed the
                requirements below before proceeding.
            </p>
            <div className="space-y-4">
                {requirementsCheckboxGroup.map((c) => (
                    <div key={c.id} className="flex items-start space-x-3">
                        <Checkbox id={c.id} value={c.id} defaultChecked={requirementsValidation.data?.requirements.includes(c.id)} onCheckedChange={e => {

                            const reqs = requirementsValidation.data?.requirements || []

                            if (!reqs) return
                            reqs.push(c.id)
                            const serializedData = serialize({
                                data: { requirements: [...new Set(reqs)] },
                                schema: requirementsSchema
                            })
                            router.push(`?${serializedData.toString()}`)

                        }} />
                        <label
                            htmlFor={c.id}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {c.text}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

