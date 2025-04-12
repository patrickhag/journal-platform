import { NextResponse } from 'next/server';
import { put, PutBlobResult } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();

  const files = Array.from(formData.getAll('files')).filter(
    (file): file is File => file instanceof File
  );

  const filenames = files.map((file) => file.name);

  const chunks = files.map((file) => file.stream());

  const blob: PutBlobResult[] = [];

  for (const filename of filenames) {
    blob.push(
      await put(filename, chunks[filenames.indexOf(filename)], {
        access: 'public',
      })
    );
  }

  if (blob.length <= 0) {
    return NextResponse.json(
      { message: 'File(s) did not upload' },
      { status: 400 }
    );
  }

  return NextResponse.json(blob);
}
