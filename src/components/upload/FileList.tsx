"use client";
import { filesSchema } from "@/schemas/reviewer";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeParse, serialize } from "zod-urlsearchparams";
import { Button } from "../ui/button";
import FileTypesModal from "./FileTypeModel";

export const FileList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];

  return (
    <>
      {files.map((file) => (
        <div
          key={file.publicId}
          className="flex items-center justify-between rounded-lg border p-4"
        >

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
              <p className="font-medium">{file.originalName}</p>
              <p className="text-sm text-gray-500">
                {file.originalName.slice(file.originalName.lastIndexOf("."))} |{" "}
                {Math.floor(Number.parseInt(file.bytes!) / 1024)} Kb
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex space-x-2">
              <FileTypesModal
                originalName={file.originalName}
                publicId={file.publicId}
                resourceType={file.resourceType}
              >
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </FileTypesModal>
              <form
                action={() => {
                  const serializedData = serialize({
                    data: {
                      files: files.filter((f) => f.publicId !== file.publicId),
                    },
                    schema: filesSchema,
                  });

                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("files");
                  router.push(
                    `?${params.toString()}&${serializedData.toString()}`,
                  );
                }}
              >
                <input type="hidden" name="publicId" value={file.publicId} />
                <Button variant="outline" size="icon" type="submit">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </form>
            </div>
            {file.fileType && (
              <small className="bg-gray-300 py-1 px-2 rounded-sm">
                {file.fileType}
              </small>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
