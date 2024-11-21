"use client"

import { FC, PropsWithChildren, useActionState, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addFileType } from "@/lib/actions"
import { Button } from "../ui/button"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Alert, AlertTitle } from "../ui/alert"

const fileTypes = [
    { value: "article", label: "Article Text" },
    { value: "instrument", label: "Research Instrument" },
    { value: "materials", label: "Research Materials" },
    { value: "results", label: "Research Results" },
    { value: "transcripts", label: "Transcripts" },
    { value: "analysis", label: "Data Analysis" },
    { value: "sources", label: "Source Texts" },
    { value: "other", label: "Other" },
]

const FileTypesModal: FC<{
    publicId: string;
    resourceType: string;
    originalName: string
} & PropsWithChildren> = ({
    children,
    originalName,
    publicId,
    resourceType
}) => {
        const [open, setOpen] = useState(false)

        const [response, formAction, isPending] = useActionState(
            addFileType,
            undefined,
        );
        useEffect(() => {

            if (response === 'success') {
                setOpen(false)
            }
        }, [response])

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>
                        <Alert variant={"destructive"}>
                            <AlertTitle>{response}</AlertTitle>
                        </Alert>

                        <p>{response}</p>
                    </DialogTitle>

                    <Card className="border-0 shadow-none">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-2xl font-bold">File types</CardTitle>
                            <p className="text-muted-foreground">Choose the option that best describes this file.</p>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <form action={formAction}>
                                <input type="hidden" name="publicId" value={publicId} />
                                <input type="hidden" name="resourceType" value={resourceType} />
                                <input type="hidden" name="originalName" value={originalName} />
                                <RadioGroup name="fileType" defaultValue="article" className="space-y-3">
                                    {fileTypes.map((option) => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.value} id={option.value} />
                                            <Label htmlFor={option.value} className="font-normal">
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                <Button type="submit" className="mt-4" disabled={isPending}>{isPending ? 'Saving ...' : 'Save'}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        )
    }

export default FileTypesModal