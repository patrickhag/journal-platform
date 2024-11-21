import { createUpload } from '@/lib/actions'
import { Upload } from 'lucide-react'
import { FC, useActionState, useEffect, useRef } from 'react'
import { Alert } from '../ui/alert'

export const Uploadbanner: FC<{ fileFormats: string[]; onSuccess: (file: any) => void }> = ({ fileFormats, onSuccess }) => {
    const form = useRef<HTMLFormElement>(null)
    const [responseMessage, formAction, isPending] = useActionState(
        createUpload,
        undefined,
    );
    useEffect(() => {
        if (responseMessage?.data) {
            onSuccess(responseMessage.data)
        }
    }, [responseMessage?.data])
    return (
        <form action={formAction} ref={form} className="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            {responseMessage?.message && <Alert>
                {responseMessage.message}
            </Alert>}
            <label onClick={() => { }} htmlFor='files'>
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-lg text-gray-600">Drag and drop or click to choose files</p>
                <p className="text-sm text-gray-500">{fileFormats.map(f => (<span key={f}>{f} </span>))} are allowed</p>

                <input type="file" name="files" id="files" className='hidden' accept={fileFormats.join(',')} onChange={() => {
                    form.current?.requestSubmit()
                }} />
            </label>
        </form>

    )
}
