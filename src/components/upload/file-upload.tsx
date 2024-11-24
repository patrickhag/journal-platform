"use client"
import { Card } from "@/components/ui/card"
import { useCallback, } from "react"
import { Sidebar } from "../Sidebar"
import { Paginator } from "./Paginator"
import { FileList } from "./FileList"
import { ProgressLine } from "./Progress"
import { Uploadbanner } from "./Uploadbanner"
import { useSearchParams, useRouter } from "next/navigation"
import { TNewJournal } from "@/lib/pages";
import { safeParse } from "zod-urlsearchparams";
import { filesSchema } from "@/schemas/reviewer"

const fileFormats = [".DOC*", ".PDF"];


export default function FileUpload() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const filesValidation = safeParse({
        schema: filesSchema,
        input: new URLSearchParams(searchParams.toString()),
    })

    const createQueryString = useCallback<(name: string, value: TNewJournal) => string>(
        (name: string, value: TNewJournal) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])

    const files = filesValidation.data?.files || []

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-10">
                <ProgressLine />
                <h1 className="mb-6 text-3xl font-bold">Upload files</h1>
                <Card className="mb-6 p-6">
                    <Uploadbanner fileFormats={fileFormats} />
                    <div className="space-y-4">
                        <FileList files={files} />
                    </div>
                </Card>
                <Paginator disabled={files.length <= 0 || files.some(f => !f.fileType)} onBack={() => {
                    router.push(`?${createQueryString("page", 'start')}`)
                }} onNext={() => {
                    router.push(`?${createQueryString("page", 'Enter metadata')}`)
                }} />
            </main>
        </div >
    )
}
