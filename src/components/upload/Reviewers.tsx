import React from 'react'
import { useSearchParams } from 'next/navigation'
import { safeParse } from 'zod-urlsearchparams'
import { z } from 'zod'
import { reviewerSchema } from '@/schemas/reviewer'
import { Reviewer } from './Reviewr'


export const Reviewers = () => {
    const searchParams = useSearchParams()

    const reviewersValidation = safeParse({
        schema: z.object({
            reviewers: z.array(reviewerSchema)
        }),
        input: new URLSearchParams(searchParams.toString()),
    })

    const reviewers = reviewersValidation.data?.reviewers || []
    return (
        <>
            {reviewers.map((r) => <Reviewer key={r.email} {...r} />)}
        </>

    )
}


