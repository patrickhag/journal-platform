"use client"
import { Card } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Sidebar } from "../Sidebar"
import { Paginator } from "./Paginator"
import { FileList } from "./FileList"
import { ProgressLine } from "./Progress"
import { Uploadbanner } from "./Uploadbanner"
import { useSearchParams, useRouter } from "next/navigation"
import { TNewJournal } from "@/lib/pages";

const fileFormats = [".DOC*", ".PDF"];

export default function FileUpload() {
    const [files, setFiles] = useState<CloudinaryUploadWidgetInfo[]>([]);
    const router = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback<(name: string, value: TNewJournal) => string>(
        (name: string, value: TNewJournal) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])

    useEffect(() => {
        router.push(`?${createQueryString("files", JSON.stringify(files.map(f => f.public_id)) as TNewJournal)}`)
    }, [files])

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-10">
                <ProgressLine />
                <h1 className="mb-6 text-3xl font-bold">Upload files</h1>
                <Card className="mb-6 p-6">
                    <Uploadbanner fileFormats={fileFormats} onSuccess={(file) => {
                        setFiles([...files, file])
                    }} />
                    <div className="space-y-4">
                        <FileList files={files} setFiles={setFiles} />
                    </div>
                </Card>
                <Paginator onBack={() => {
                    router.push(`?${createQueryString("page", 'start')}`)
                }} onNext={() => {
                    router.push(`?${createQueryString("page", 'Enter metadata')}`)
                }} />
            </main>
        </div >
    )
}

