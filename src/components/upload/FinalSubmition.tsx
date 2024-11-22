"use client"

import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitAction } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Alert } from "../ui/alert"

export default function FinalSubmissionForm() {
    const searchParams = useSearchParams()

    const [errorMessage, formAction, isPending] = useActionState(
        submitAction,
        undefined,
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <ProgressLine />
                <form action={formAction} className="p-8 bg-white rounded-lg shadow-md">
                    {errorMessage?.message && <Alert>
                        {errorMessage?.message}
                    </Alert>}
                    <input type="hidden" name="others" value={searchParams.toString()} />
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
                    <div className="flex justify-between mt-4">
                        <Button variant="outline">Go back</Button>
                        <Button disabled={isPending}>Submit</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
