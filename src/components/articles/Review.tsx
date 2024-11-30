"use client"

import { startTransition, useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { submitReviewAction } from "@/lib/submitionAction"
import { Uploadbanner } from "../upload/Uploadbanner"
import { fileFormats } from "@/lib/consts"
import { FileList } from "../upload/FileList"
import { useParams, useSearchParams } from "next/navigation"
import { safeParse } from "zod-urlsearchparams"
import { filesSchema } from "@/schemas/reviewer"
import Spinner from "../Spinner"

export default function ReviewModal() {
    const [open, setOpen] = useState(false)
    const [errorMessage, formAction, isPending] = useActionState(
        submitReviewAction,
        undefined,
    );
    const searchParams = useSearchParams();
    const { articleId } = useParams()
    const filesValidation = safeParse({
        schema: filesSchema,
        input: new URLSearchParams(searchParams.toString()),
    });

    const files = filesValidation.data?.files || [];
    console.log(errorMessage)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-blue-500 hover:text-blue-600 px-0">
                    Write a review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-[#1a237e]">Write a review</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
                    </DialogDescription>
                </DialogHeader>
                <Uploadbanner fileFormats={fileFormats} />
                <FileList />
                <form action={formAction} className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xl font-medium">
                            Leave a message
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="What is your update"
                            className="min-h-[150px] resize-none p-4 text-gray-500 bg-white rounded-lg"
                        />
                    </div>
                    <input type="text" name="fileIds" id="fileIds" value={JSON.stringify(files.map(f => f.publicId))} readOnly className="hidden" />
                    <input type="text" name="articleId" id="articleId" value={articleId} readOnly className="hidden" />

                    <div className="space-y-3">

                        <Button disabled={isPending} className="bg-[#626EEF]">
                            Submit {isPending && <Spinner />}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}

