"use client"
import { useState } from "react"
import { Contributors } from "../Contributors"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import NewContibutorForm from "../Contibutor"
import {  z } from "zod"
import { safeParse, serialize } from "zod-urlsearchparams"
import { useRouter, useSearchParams } from "next/navigation"
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export const metadataSchema = z.object({
    prefix: z.string().min(2),
    title: z.string().min(2),
    subtitle: z.string().min(2),
    abstract: z.string().min(2)
})

export const ContributorsForm = () => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const metaValidation = safeParse({
        schema: metadataSchema,
        input: new URLSearchParams(searchParams.toString()),
    })

    const [modalOpen, setModalOpen] = useState(false)
    const [abstract, setAbstract] = useState(metaValidation.data?.abstract)

    return (
        <>
            <form action={(formData) => {
                const data = Object.fromEntries(formData.entries())
                const meta = metadataSchema.safeParse(data)
                if (meta.error) return

                const serializedData = serialize({
                    data: Object.fromEntries(formData.entries()) as z.infer<typeof metadataSchema>,
                    schema: metadataSchema,
                })

                const params = new URLSearchParams(searchParams.toString())
                Object.keys(data).forEach(key => {
                    params.delete(key)
                })

                console.log(searchParams.toString())

                router.push(`?${params.toString()}&${serializedData.toString()}`)
            }}>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="prefix">Prefix *</Label>
                        <Input id="prefix" name="prefix" defaultValue={metaValidation?.data?.prefix} placeholder="A, the" />
                    </div>
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" name="title" defaultValue={metaValidation?.data?.title} placeholder="Title of the journal" />
                    </div>
                </div>
                <div className="mb-4">
                    <Label htmlFor="subtitle">Subtitle *</Label>
                    <Input id="subtitle" name="subtitle" defaultValue={metaValidation?.data?.subtitle} placeholder="Subtitle of the journal" />
                </div>
                <div className="mb-4 py-3">
                    <Label htmlFor="abstract">Abstract *</Label>
                    <ReactQuill  theme="snow" value={abstract}  onChange={setAbstract}
                                className="h-32 mb-4"
                                />
                    <Textarea className="hidden"  id="abstract" name="abstract" defaultValue={abstract} placeholder="Abstract of the journal" rows={4} />
                </div>

                <Button variant="secondary" className="mt-4" type="submit">
                    Save meta
                </Button>
            </form>
            <div className="my-4">
                <h3 className="mb-2 text-lg font-semibold">Contributors</h3>
                <div className="overflow-x-auto">
                    <Contributors />
                </div>
                <NewContibutorForm open={modalOpen} onOpenChange={setModalOpen} />
                <Button onClick={() => setModalOpen(!modalOpen)} variant="outline" className="mt-4" type="submit">
                    Add contributor
                </Button>
            </div>
        </>
    )
}
