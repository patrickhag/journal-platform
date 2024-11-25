'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Sidebar } from "../Sidebar"

import React, { useCallback } from 'react'
import { Paginator } from "./Paginator"
import { useRouter, useSearchParams } from "next/navigation"
import { TNewJournal } from "@/lib/pages"
import { ArticleTypeSection } from "./ArticleTypeSection"
import { SubmissionRequirementsSection } from "./SubmissionRequirementsSection"
import { safeParse } from "zod-urlsearchparams";
import { articleSubmitionSchema } from "@/schemas/reviewer"
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ProgressLine } from "./Progress"

export default function ArticleSubmitionForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback<(name: string, value: TNewJournal) => string>(
        (name: string, value: TNewJournal) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])

    const articleValidation = safeParse({
        input: searchParams,
        schema: articleSubmitionSchema
    })

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <ProgressLine />
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-8">
                            <ArticleTypeSection />
                            <SubmissionRequirementsSection />
                            <div className="my-4 py-3">
                                <h2 className="text-xl font-semibold mb-4">
                                    Comments for the editor
                                </h2>

                                <ReactQuill theme="snow" value={searchParams.get('Comments for the editor') || undefined} onChange={(e) => {
                                    router.push(`?${createQueryString("Comments for the editor", e as TNewJournal)}`)
                                }}
                                    className="h-32 mb-4"
                                />

                            </div>

                            <Paginator disabled={!articleValidation.success} onBack={() => {
                                router.push(`?${createQueryString("page", 'start')}`)
                            }} onNext={() => {
                                router.push(`?${createQueryString("page", 'Attach files')}`)
                            }} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
