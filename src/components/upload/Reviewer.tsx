import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, User } from 'lucide-react'
import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { Reviewers } from "./Reviewers"
import { Paginator } from "./Paginator"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import AddReviewerModal, { ReviewerFormValues } from "./AddReviewerModal"
import { TNewJournal } from "@/lib/pages"

export default function Reviewer() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [reviewers, setReviewers] = useState<ReviewerFormValues[]>([])
    const createQueryString = useCallback(
        (name: string, value: TNewJournal) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])
    const [open, setOpen] = useState(false)
    function handleSubmit(data: ReviewerFormValues) {
        setReviewers(prev => [...prev, data])
    }
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="flex h-16 items-center px-4 gap-4 container">
                    <h1 className="text-xl font-semibold">Journal of African Epidemiology and Public health</h1>
                    <div className="ml-auto flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="space-y-8">
                        <ProgressLine />

                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Reviewers</h2>

                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-medium">When suggesting reviewers or editors for your submission, please include:</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <span className="mt-1">•</span>
                                            <p>Full Name: Provide the full name, and affiliation to ensure we identify the correct person.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1">•</span>
                                            <p>Expertise and Relevance: Briefly describe why this individual is suitable to review your work, emphasizing their expertise or familiarity with your research topic.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1">•</span>
                                            <p>Contact Information: If possible, provide an email address or other contact details to facilitate the review process.</p>
                                        </li>
                                    </ul>
                                    <p className="text-muted-foreground">Your recommendations help us select reviewers who are knowledgeable and impartial, enhancing the quality of the review process.</p>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Proposed reviewers list</h3>

                                <div className="space-y-4">
                                    <Reviewers reviewers={reviewers} />
                                </div>

                                <Button onClick={() => setOpen(true)}>Add reviewer</Button>
                                <AddReviewerModal
                                    open={open}
                                    onOpenChange={setOpen}
                                    onSubmit={handleSubmit}
                                />
                                <Paginator onBack={() => {
                                    router.push(`?${createQueryString("page", 'Enter metadata')}`)

                                }} onNext={() => {
                                    router.push(`?${createQueryString("page", 'Final submit')}`)
                                }} />
                            </div>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    )
}