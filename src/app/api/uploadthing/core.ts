import { auth } from '@/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const uploadFileOption = {
  maxFileSize: '4MB',
  maxFileCount: 6,
} as const;

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: uploadFileOption,
    pdf: uploadFileOption,
    blob: uploadFileOption,
    text: uploadFileOption,
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await auth();

      const user = session?.user;
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log('metadata>>>', metadata);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
