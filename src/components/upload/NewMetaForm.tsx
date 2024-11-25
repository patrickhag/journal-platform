"use client"
import React, { FC, RefObject, useState } from 'react'
import { metadataSchema } from './ContributorsForm'
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import ReactQuill from 'react-quill-new';
import { safeParse, serialize } from "zod-urlsearchparams"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const NewMetaForm: FC<{
    form: RefObject<HTMLFormElement>
}> = ({ form }) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const metaValidation = safeParse({
        schema: metadataSchema,
        input: new URLSearchParams(searchParams.toString()),
    })
    const formm = useForm<z.infer<typeof metadataSchema>>({
        resolver: zodResolver(metadataSchema),
        defaultValues: metaValidation.data || {
          title:'',
          prefix:'',
          abstract:'',
          subtitle: ''
        }
    })

    const saveMeta = formm.handleSubmit((data) => {
        const meta = metadataSchema.safeParse(data)
        if (meta.error) return

        const serializedData = serialize({
            data,
            schema: metadataSchema,
        })

        const params = new URLSearchParams(searchParams.toString())
        Object.keys(data).forEach(key => {
            params.delete(key)
        })

        router.push(`?${params.toString()}&${serializedData.toString()}`)
        router.refresh()

        form.current?.setAttribute('submited', 'submited')
    })
    return (
        <Form {...formm}>
            <form ref={form}
                onSubmit={saveMeta}>
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <FormField name='prefix' control={formm.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="prefix">Prefix *</FormLabel>
                            <FormControl>
                                <Input placeholder="A, the" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name='title' control={formm.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="title">Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="Title of the journal" {...field} />
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )} />
                </div>
                <FormField name='subtitle' control={formm.control} render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel htmlFor="subtitle">Subtitle *</FormLabel>
                        <FormControl>
                            <Input placeholder="Subtitle of the journal" {...field} />
                        </FormControl>
                        <FormMessage />

                    </FormItem>
                )} />
                <FormField name='abstract' control={formm.control} render={({ field }) => (
                    <FormItem className="mb-4 py-3">
                        <FormLabel htmlFor="abstract">Abstract *</FormLabel>
                        <ReactQuill theme="snow" value={formm.getValues().abstract} onChange={(d) => {
                            formm.setValue('abstract', d)
                        }}
                            className="h-32 mb-4"
                        />
                        <FormControl>
                            <Textarea className="hidden" placeholder="Abstract of the journal" rows={4} {...field} />
                        </FormControl>
                        <FormMessage />

                    </FormItem>
                )} />
            </form>
        </Form>
    )
}
