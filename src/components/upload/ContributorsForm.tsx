import { useActionState } from "react"
import { Contributors } from "../Contributors"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { createContributor } from "@/lib/actions"
import { Alert, AlertTitle } from "../ui/alert"

export const ContributorsForm = () => {
    const [message, formAction, isPending] = useActionState(
        createContributor,
        undefined,
    );

    return (
        <form action={formAction}>
            <Alert variant={"destructive"}>
                <AlertTitle>{message?.message}</AlertTitle>
            </Alert>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="prefix">Prefix *</Label>
                    <Input id="prefix" name="prefix" defaultValue={message?.data?.prefix.toString()} placeholder="A, the" />
                </div>
                <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" name="title" defaultValue={message?.data?.title.toString()} placeholder="Title of the journal" />
                </div>
            </div>
            <div className="mb-4">
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Input id="subtitle" name="subtitle" defaultValue={message?.data?.subtitle.toString()} placeholder="Subtitle of the journal" />
            </div>
            <div className="mb-4">
                <Label htmlFor="abstract">Abstract *</Label>
                <Textarea id="abstract" name="abstract" defaultValue={message?.data?.abstract.toString()} placeholder="Abstract of the journal" rows={4} />
            </div>
            <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Contributors</h3>
                <div className="overflow-x-auto">
                    <Contributors />
                </div>
                <Button variant="outline" className="mt-4" disabled={isPending} type="submit">
                    Add contributor
                </Button>
            </div>
        </form>
    )
}