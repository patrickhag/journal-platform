'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "../Sidebar"

import React, { useCallback } from 'react'
import { Paginator } from "./Paginator"
import { useRouter, useSearchParams } from "next/navigation"
import { TNewJournal } from "@/lib/pages"
import { ArticleTypeSection } from "./ArticleTypeSection"
import { SubmissionRequirementsSection } from "./SubmissionRequirementsSection"

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

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-8">
                            <ArticleTypeSection />
                            <SubmissionRequirementsSection />
                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Comments for the editor
                                </h2>
                                <Textarea
                                    className="min-h-[150px]"
                                    placeholder="Enter your comments here..."
                                    onChange={(e) => {
                                        router.push(`?${createQueryString("Comments for the editor", e.target.value as any)}`)
                                    }}
                                />
                            </div>

                            <Paginator onBack={() => {
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
