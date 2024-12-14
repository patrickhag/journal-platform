'use server';

import { v2 as cloudinary } from 'cloudinary';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function createUpload(
    _: { message?: string; data?: CloudinaryUploadWidgetInfo } | undefined,
    formData: FormData
) {
    const files = formData.get('files');
    console.log(files);
    const fileBuffer = await (files instanceof Blob ? files.arrayBuffer() : null);

    const mime = (files as File)?.type;
    const encoding = 'base64';
    const base64Data = fileBuffer
        ? Buffer.from(fileBuffer).toString('base64')
        : '';
    const fileUri = `data:${mime};${encoding},${base64Data}`;
    try {
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload(fileUri, {
                        invalidate: true,
                    })
                    .then(resolve)
                    .catch(reject);
            });
        };

        const result = (await uploadToCloudinary()) as CloudinaryUploadWidgetInfo;
        if (!result) {
            return { message: 'Upload failed' };
        }

        console.log(result.url);
        return { data: { ...result, name: (files as File).name } };
    } catch (error) {
        console.log('server err', error);
        return { message: 'Internal Server Error' };
    }
}
