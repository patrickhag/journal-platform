"use client"

import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation"
import { startTransition, useActionState, useCallback } from "react"
import { Alert } from "../ui/alert"
import { submitAction } from "@/lib/submitionAction"
import { z } from "zod"
import { metadataSchema } from "./ContributorsForm"
import { articleSubmitionSchema, filesSchema, finalSubmissionSchema, reviewerSchema } from "@/schemas/reviewer"
import * as zu from "zod-urlsearchparams"
import { contributorFormSchema } from "@/schemas/upload"
import { Paginator } from "./Paginator"
import { TNewJournal } from "@/lib/pages"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
    const form = useForm<z.infer<typeof finalSubmissionSchema>>({
        resolver: zodResolver(finalSubmissionSchema),
        defaultValues: {
            ethicalReference: "",
            founders: ''
        }
    })


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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(data => {
                            const fm = new FormData()
                            for (const key in data) {
                                if (data.hasOwnProperty(key)) {
                                    fm.append(key, data[key as keyof typeof data] as string)
                                }

                            }
                            fm.append("metadataValidations", JSON.stringify(metadataValidations))
                            fm.append("contributorValidations", JSON.stringify(contributorValidations.contributors))
                            fm.append("filesValidations", JSON.stringify(filesValidations.files))
                            fm.append("articleSubmitionValidations", JSON.stringify(articleSubmitionValidations))
                            fm.append("reviewerValidations", JSON.stringify(reviewerValidations.reviewers))
                            startTransition(() => {
                                formAction(fm)

                            })
                        })}

                        className="p-8 bg-white rounded-lg shadow-md">
                        {errorMessage?.message && <Alert variant={"destructive"} className="my-4">
                            {errorMessage?.message}
                        </Alert>}
                        <h2 className="mb-4 text-xl font-semibold">Final submission</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="grid">
                                <FormField control={form.control} name="funded" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block mb-2">
                                            Was this study funded? <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup className="flex space-x-4" {...field}>
                                                <RadioGroupItem value="yes" id="funded-yes" />
                                                <Label htmlFor="funded-yes">yes</Label>
                                                <RadioGroupItem value="no" id="funded-no" />
                                                <Label htmlFor="funded-no">no</Label>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                )} />

                                <FormField control={form.control} name="founders" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="If yes write the funding organization" className="mt-2" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />

                            </div>

                            <div className="grid">
                                <FormField control={form.control} name="ethical" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block mb-2">
                                            Was this study given an ethical clearance? <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup className="flex space-x-4" {...field}>
                                                <RadioGroupItem value="yes" id="ethical-yes" />
                                                <Label htmlFor="ethical-yes">yes</Label>
                                                <RadioGroupItem value="no" id="ethical-no" />
                                                <Label htmlFor="ethical-no">no</Label>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="ethicalReference" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="If yes write its reference number" className="mt-2" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                            <FormField control={form.control} name="consent" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block mb-2">Has this study provided informed consent?</FormLabel>
                                    <FormControl>
                                        <RadioGroup className="flex space-x-4" {...field}>
                                            <RadioGroupItem value="yes" id="consent-yes" />
                                            <Label htmlFor="consent-yes">yes</Label>
                                            <RadioGroupItem value="no" id="consent-no" />
                                            <Label htmlFor="consent-no">no</Label>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="human" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block mb-2">
                                        Has this study included Human part such as blood samples, tissues? <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup className="flex space-x-4" {...field}>
                                            <RadioGroupItem value="yes" id="human-yes" />
                                            <Label htmlFor="human-yes">yes</Label>
                                            <RadioGroupItem value="no" id="human-no" />
                                            <Label htmlFor="human-no">no</Label>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div>
                            <p className="mt-6 text-sm text-gray-600">
                                Your submission has been uploaded and is ready to be sent. You may go back to review and adjust any of the information you have entered before continuing. When you are ready, click &quot;Submit&quot;.
                            </p>
                            <div className="flex items-end justify-between mt-4">
                                <Paginator disabled={isPending} onBack={() => {
                                    router.push(`?${createQueryString("page", 'Reviewers')}`)

                                }} />
                                <Button disabled={isPending}>Submit</Button>
                            </div>
                        </div>
                    </form>
                </Form >
            </main>
        </div>
    )
}
