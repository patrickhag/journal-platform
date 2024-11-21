import { Upload } from 'lucide-react'
import { CloudinaryUploadWidgetInstanceMethodOpenOptions, CloudinaryUploadWidgetSources } from 'next-cloudinary';
import { FC } from 'react'

export const Uploadbanner: FC<{ fileFormats: string[]; open: (widgetSource?: CloudinaryUploadWidgetSources, options?: CloudinaryUploadWidgetInstanceMethodOpenOptions) => void }> = ({ fileFormats, open }) => {
    return (
        <div onClick={() => open()} className="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-600">Drag and drop or click to choose files</p>
            <p className="text-sm text-gray-500">{fileFormats.map(f => (<span key={f}>{f} </span>))} are allowed</p>
        </div>

    )
}
