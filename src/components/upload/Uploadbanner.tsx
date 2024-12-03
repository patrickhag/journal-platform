"use client";
import { createUpload } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { filesSchema } from "@/schemas/reviewer";
import { Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, startTransition, useActionState, useCallback, useEffect, useRef } from "react";
import { safeParse, serialize } from "zod-urlsearchparams";
import { Alert } from "../ui/alert";
import { useDropzone } from 'react-dropzone';

export const Uploadbanner: FC<{ fileFormats: string[] }> = ({
  fileFormats,
}) => {
  const [responseMessage, formAction, isPending] = useActionState(
    createUpload,
    undefined,
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const files = filesValidation.data?.files || [];
  const file = responseMessage?.data;

  useEffect(() => {
    if (!file) return;
    files.push({
      originalName: file.name,
      publicId: file.url,
      resourceType: file.resource_type,
      bytes: file.bytes.toString(),
    });
    const serializedData = serialize({
      data: { files },
      schema: filesSchema,
    });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("files");
    router.push(`?${params.toString()}&${serializedData.toString()}`);
  }, [responseMessage?.data?.public_id]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });
    console.log(formData);
    startTransition(() => {
      formAction(formData);
    });
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept:{
    'pdf': ['application/pdf'],
    'doc': ['application/msword'],
    'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'txt': ['text/plain'],
    'rtf': ['application/rtf'],
    'odt': ['application/vnd.oasis.opendocument.text'],
  } });

  return (
    <div
      className={cn(
        "mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center",
        isPending && "bg-yellow-50",
      )}
    >
      {responseMessage?.message && <Alert>{responseMessage.message}</Alert>}
      <label onClick={() => { }} htmlFor="files"
        {...getRootProps()}

      >
        <Upload
          className={cn(
            "mx-auto mb-4 h-12 w-12 text-gray-400",
            isPending && "animate-bounce",
          )}
        />
        <input {...getInputProps()} name="files" />
        <p className="text-lg text-gray-600">
          Drag and drop or click to choose files
        </p>
        <p className="text-sm text-gray-500">
          {fileFormats.map((f) => (
            <span key={f}>{f} </span>
          ))}{" "}
          are allowed
        </p>
      </label>
    </div>
  );
};
