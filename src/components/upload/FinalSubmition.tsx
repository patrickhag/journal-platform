"use client"

import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useCallback } from "react"
import { Alert } from "../ui/alert"
import { submitAction } from "@/lib/submitionAction"
import { z } from "zod"
import { metadataSchema } from "./ContributorsForm"
import { articleSubmitionSchema, filesSchema, reviewerSchema } from "@/schemas/reviewer"
import * as zu from "zod-urlsearchparams"
import { contributorFormSchema } from "@/schemas/upload"
import { Paginator } from "./Paginator"
import { TNewJournal } from "@/lib/pages"

export default function FinalSubmissionForm() {
    const searchParams = useSearchParams()

    const router = useRouter()

    const createQueryString = useCallback(
        (name: string, value: TNewJournal) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])
    const [errorMessage, formAction, isPending] = useActionState(
        submitAction,
        undefined,
    );

    const others = searchParams.toString()
    if (!others) return <div>Failed to submit</div>

    const metadataValidations = zu.parse({
        input: new URLSearchParams(others),
        schema: metadataSchema
    })

    const reviewerValidations = zu.parse({
        input: new URLSearchParams(others),
        schema: z.object({
            reviewers: z.array(reviewerSchema)
        })
    })
    const articleSubmitionValidations = zu.parse({
        input: new URLSearchParams(others),
        schema: articleSubmitionSchema
    })
    const filesValidations = zu.parse({
        input: new URLSearchParams(others),
        schema: filesSchema
    })
    const contributorValidations = zu.parse({
        input: new URLSearchParams(others),
        schema: z.object({
            contributors: z.array(contributorFormSchema),
        })
    })

    if (errorMessage?.message === "success") return <div>Success</div>
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <ProgressLine />
                <form
                    action={formData => {
                        formData.append("metadataValidations", JSON.stringify(metadataValidations))
                        formData.append("contributorValidations", JSON.stringify(contributorValidations.contributors))
                        formData.append("filesValidations", JSON.stringify(filesValidations.files))
                        formData.append("articleSubmitionValidations", JSON.stringify(articleSubmitionValidations))
                        formData.append("reviewerValidations", JSON.stringify(reviewerValidations.reviewers))
                        formAction(formData)
                    }}

                    className="p-8 bg-white rounded-lg shadow-md">
                    {errorMessage?.message && <Alert>
                        {errorMessage?.message}
                    </Alert>}
                    <h2 className="mb-4 text-xl font-semibold">Final submission</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label className="block mb-2">
                                Was this study funded? <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup name="funded" className="flex space-x-4">
                                <RadioGroupItem value="yes" id="funded-yes" />
                                <Label htmlFor="funded-yes">yes</Label>
                                <RadioGroupItem value="no" id="funded-no" />
                                <Label htmlFor="funded-no">no</Label>
                            </RadioGroup>
                            <Input placeholder="If yes write the founders" className="mt-2" />
                        </div>
                        <div>
                            <Label className="block mb-2">
                                Was this study given an ethical clearance? <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup name="ethical" className="flex space-x-4">
                                <RadioGroupItem value="yes" id="ethical-yes" />
                                <Label htmlFor="ethical-yes">yes</Label>
                                <RadioGroupItem value="no" id="ethical-no" />
                                <Label htmlFor="ethical-no">no</Label>
                            </RadioGroup>
                            <Input placeholder="If yes write its reference number" className="mt-2" />
                        </div>
                        <div>
                            <Label className="block mb-2">Has this study provided informed consent?</Label>
                            <RadioGroup name="consent" className="flex space-x-4">
                                <RadioGroupItem value="yes" id="consent-yes" />
                                <Label htmlFor="consent-yes">yes</Label>
                                <RadioGroupItem value="no" id="consent-no" />
                                <Label htmlFor="consent-no">no</Label>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label className="block mb-2">
                                Has this study included Human part such as blood samples, tissues? <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup name="human" className="flex space-x-4">
                                <RadioGroupItem value="yes" id="human-yes" />
                                <Label htmlFor="human-yes">yes</Label>
                                <RadioGroupItem value="no" id="human-no" />
                                <Label htmlFor="human-no">no</Label>
                            </RadioGroup>
                        </div>
                    </div>
                    <p className="mt-6 text-sm text-gray-600">
                        Your submission has been uploaded and is ready to be sent. You may go back to review and adjust any of the information you have entered before continuing. When you are ready, click &quot;Submit&quot;.
                    </p>
                    <div className="flex items-end justify-between mt-4">
                        <Paginator disabled={isPending} onBack={() => {
                            router.push(`?${createQueryString("page", 'Reviewers')}`)

                        }} />
                        <Button disabled={isPending}>Submit</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
