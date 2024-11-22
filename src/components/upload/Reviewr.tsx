import React, { FC, useState } from 'react'
import { Avatar } from '../ui/avatar'
import { Edit2, Trash2, User } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { safeParse, serialize } from 'zod-urlsearchparams'
import { z } from 'zod'
import { reviewerSchema } from '@/schemas/reviewer'
import UpdateReviewerModal from './UpdateReviewerModal'


export const Reviewer:FC<z.infer<typeof reviewerSchema>> = ({email, names, expertise})=>{
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const reviewersValidation = safeParse({
        schema: z.object({
            reviewers: z.array(reviewerSchema)
        }),
        input: new URLSearchParams(searchParams.toString()),
    })

    const reviewers = reviewersValidation.data?.reviewers || []


    return (
        <div key={email + names} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar>
                <User className="w-5 h-5" />
            </Avatar>
            <div className="flex-1">
                <h4 className="font-medium">{names}</h4>
                <p className="text-sm text-muted-foreground">{expertise}</p>
            </div>
            <div className="flex items-center gap-2">
                <UpdateReviewerModal email={email} onOpenChange={(open) => {
                    setOpen(open)
                 }} open={open} />
                <Button variant="ghost" size="icon" onClick={() => {
                    setOpen(!open)
                }}>
                    <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                    const serializedData = serialize({
                        data: { reviewers: reviewers.filter(r => r.email !== email) },
                        schema: z.object({
                            reviewers: z.array(reviewerSchema)
                        })
                    })

                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('reviewers')
                    router.push(`?${params.toString()}&${serializedData.toString()}`)

                }}>
                    <Trash2 className="w-4 h-4" />
                </Button>
                <span className="bg-muted px-2 py-1 rounded text-sm">Reviewer</span>
            </div>
        </div>
    )
}