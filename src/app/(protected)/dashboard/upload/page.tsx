"use client"
import FileUpload from "@/components/upload/file-upload"
import MetadataForm from "@/components/upload/metadata-form"
import { useSearchParams } from "next/navigation"

export default function Upload() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 'uploads'
  const Component = (page: string) => {
    return ({
      uploads: <FileUpload />,
      'meta-data': <MetadataForm />,
    })[page]
  }
  return Component(page) ?? <FileUpload />
}