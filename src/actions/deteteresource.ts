'use server';

import { db, articleFiles as files } from '@/db/schema';
import { v2 as cloudinary } from 'cloudinary';
import { eq } from 'drizzle-orm';

export async function deteteresource(_: unknown, formData: FormData) {
  const publicId = formData.get('publicId')?.toString();
  if (!publicId) return {};
  try {
    await db.delete(files).where(eq(files.publicId, publicId));
    const pid = publicId.split('/').at(-1)?.split('.')[0];
    if (!pid) return 'can not delete file';
    const res = await cloudinary.uploader.destroy(pid, {
      type: 'upload',
      resource_type: 'raw',
    });
    res.publicId = publicId;
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
  }
}
