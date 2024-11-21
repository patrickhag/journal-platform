import { CloudinaryUploadWidgetInfo } from "next-cloudinary"
import { Dispatch, FC, SetStateAction, useActionState, useEffect } from "react"
import { Button } from "../ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { deteteresource } from "@/lib/actions"

export const FileList: FC<{ files: CloudinaryUploadWidgetInfo[], setFiles: Dispatch<SetStateAction<CloudinaryUploadWidgetInfo[]>> }> = ({ files, setFiles }) => {
    const [response, formAction, isPending] = useActionState(
        deteteresource,
        undefined,
    );

    useEffect(() => {
        setFiles(files.filter(f => f.public_id !== response.publicId))
    }, [response?.publicId])

    return (
        <>
            {files.map((file) => (
                <div key={file.asset_id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <p className="font-medium">{file.original_filename}</p>
                            <p className="text-sm text-gray-500">{file.type} | {file.bytes / 1000} KB</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <form action={formAction}>
                            <input type="hidden" name="publicId" value={file.public_id} />
                            <Button
                                disabled={isPending}
                                variant="outline" size="icon" type="submit">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">{isPending ? "Deleting ..." : "Delete"}</span>
                            </Button>
                        </form>
                    </div>
                </div>
            ))}
        </>
    )
}
