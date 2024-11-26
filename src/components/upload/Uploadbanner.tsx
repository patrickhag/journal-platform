"use client";
import { createUpload } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { filesSchema } from "@/schemas/reviewer";
import { Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, useActionState, useEffect, useRef } from "react";
import { safeParse, serialize } from "zod-urlsearchparams";
import { Alert } from "../ui/alert";

export const Uploadbanner: FC<{ fileFormats: string[] }> = ({
	fileFormats,
}) => {
	const form = useRef<HTMLFormElement>(null);
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
			publicId: file.public_id,
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

	return (
		<form
			action={formAction}
			ref={form}
			className={cn(
				"mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center",
				isPending && "bg-yellow-50",
			)}
		>
			{responseMessage?.message && <Alert>{responseMessage.message}</Alert>}
			<label onClick={() => {}} htmlFor="files">
				<Upload
					className={cn(
						"mx-auto mb-4 h-12 w-12 text-gray-400",
						isPending && "animate-bounce",
					)}
				/>
				<p className="text-lg text-gray-600">
					Drag and drop or click to choose files
				</p>
				<p className="text-sm text-gray-500">
					{fileFormats.map((f) => (
						<span key={f}>{f} </span>
					))}{" "}
					are allowed
				</p>

				<input
					type="file"
					name="files"
					id="files"
					className="hidden"
					accept={fileFormats.join(",")}
					onChange={() => {
						form.current?.requestSubmit();
					}}
				/>
			</label>
		</form>
	);
};
