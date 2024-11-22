'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { contributorFormSchema } from "@/schemas/upload"
import { COUNTRIES } from "@/lib/consts"
import { safeParse, serialize } from "zod-urlsearchparams"
import { useRouter, useSearchParams } from "next/navigation"

export default function NewContibutorForm({
    open = false,
    onOpenChange = () => { },
}: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const validation = safeParse({
        schema: z.object({
            contributors: z.array(contributorFormSchema),
        }),
        input: new URLSearchParams(searchParams.toString()),
    })
    const form = useForm<z.infer<typeof contributorFormSchema>>({
        resolver: zodResolver(contributorFormSchema),
        defaultValues: {
            name: "",
            salutation: "",
            country: "",
            homepage: "",
            orcid: "",
            affiliation: "",
            bio: "",
            role: "author",
        },
    })
    // const params = new URLSearchParams(searchParams.toString())

    // params.delete('contributors')
    // router.push(`?${params.toString()}`)


    const onSubmit = (data: z.infer<typeof contributorFormSchema>) => {
        const contributors = validation.data?.contributors || []
        contributors.push(data)
        const serializedData = serialize({
            data: { contributors },
            schema: z.object({
                contributors: z.array(contributorFormSchema),
            })
        })
        const params = new URLSearchParams(searchParams.toString())
     
        params.delete('contributors')
        console.log(serializedData.toString())
        router.push(`?${params.toString()}&${serializedData.toString()}`)
    };


    return (
        <Dialog open={open} onOpenChange={(open) => {
            open && form.reset()
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Contributors</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground mb-4">
                    * Denotes a required field
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Names *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Full names of the contributor"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salutation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salutation *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Mr, Mrs, Ms, Dr, Prof, Rev."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {COUNTRIES.map(c => <SelectItem value={c} key={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">User details</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="homepage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Homepage URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Homepage URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="orcid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ORCID ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ORCID ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="affiliation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Affiliation *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g: Organisation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio statement *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g: department, achievements, ..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contributor&apos;s role *</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="author" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Author</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="translator" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Translator</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
