"use client"
import { Card } from "@/components/ui/card"
import { Upload } from 'lucide-react'
import { useCallback, useState } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Sidebar } from "../Sidebar"
import { Paginator } from "./Paginator"
import { FileList } from "./FileList"
import { ProgressLine } from "./Progress"
import { Uploadbanner } from "./Uploadbanner"
import { useSearchParams, useRouter } from "next/navigation"
import { useQueryString } from "@/lib/hooks/useQueryString";

const fileFormats = ["DOCX", "DOC", "PDF"];

export default function FileUpload() {
    const [files, setFiles] = useState<CloudinaryUploadWidgetInfo[]>([]);
    const router = useRouter()
    const createQueryString = useQueryString()
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-10">
                <ProgressLine />
                <h1 className="mb-6 text-3xl font-bold">Upload files</h1>
                <Card className="mb-6 p-6">
                    <CldUploadWidget

                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        signatureEndpoint="/api/sign-cloudinary-params"
                        onSuccess={(result) => {
                            if (typeof result.info === "object" && "secure_url" in result.info) {
                                setFiles(prev => [...prev, result.info as CloudinaryUploadWidgetInfo]);
                            }
                        }}

                        options={{
                            folder: "journal_upload",
                            clientAllowedFormats: fileFormats,
                            multiple: true
                        }}
                    >
                        {({ open }) => <Uploadbanner fileFormats={fileFormats} open={open} />}
                    </CldUploadWidget>
                    <div className="space-y-4">
                        <FileList files={files} setFiles={setFiles} />
                    </div>
                </Card>
                <Paginator onNext={() => {
                    router.push(`?${createQueryString("files", JSON.stringify(files.map(f => f.public_id)))}`)
                    router.push(`?${createQueryString("page", 'meta-data')}`)
                }} />
            </main>
        </div>
    )
}