import { put } from '@vercel/blob';
import formidable, { type Fields, type Files, type File } from 'formidable';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

type UploadResult = {
  url: string;
  pathname: string;
  originalFilename: string;
  mimetype?: string | null;
};

type UploadHandlerContext = {
  fields: Fields;
  files: Files;
  upload: (file: File) => Promise<UploadResult>;
};

type UploadHandler = (ctx: UploadHandlerContext) => Promise<NextResponse>;

export const runtime = 'nodejs';

export function withUpload(
  handler: UploadHandler,
  options?: formidable.Options
) {
  return async (request: Request) => {
    try {
      const { fields, files } = await parseMultipartRequest(request, options);

      const upload = async (file: File): Promise<UploadResult> => {
        const stream = createReadStream(file.filepath);
        const result = await put(
          file.originalFilename ?? file.newFilename,
          stream,
          {
            access: 'public',
            contentType: file.mimetype ?? undefined,
          }
        );

        await fs.unlink(file.filepath).catch(() => undefined);

        return {
          url: result.url,
          pathname: result.pathname,
          originalFilename: file.originalFilename ?? file.newFilename,
          mimetype: file.mimetype,
        };
      };

      return await handler({ fields, files, upload });
    } catch (error) {
      console.error('[withUpload] Failed to parse upload payload', error);
      return NextResponse.json(
        { message: 'Failed to process uploaded files.' },
        { status: 500 }
      );
    }
  };
}

async function parseMultipartRequest(
  request: Request,
  options?: formidable.Options
) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Invalid content type for upload request.');
  }

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: false,
    ...options,
  });

  const readable =
    request.body !== null
      ? Readable.fromWeb(request.body as any)
      : Readable.from([]);

  const incoming = Object.assign(readable, {
    headers: Object.fromEntries(request.headers),
    method: request.method,
    url: request.url,
  });

  return await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) => {
      form.parse(incoming as any, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    }
  );
}
