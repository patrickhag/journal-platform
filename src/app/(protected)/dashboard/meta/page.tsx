import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { ContributorsForm } from "@/components/upload/ContributorsForm";
import { NewMetaForm } from "@/components/upload/NewMetaForm";
import { Paginator } from "@/components/upload/Paginator";
import { ProgressLine } from "@/components/upload/Progress";

const Page = async ({
	searchParams,
}: {
	params: Promise<{ params: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />

			<main className="flex-1 p-10">
				<ProgressLine />

				<h1 className="mb-6 text-3xl font-bold">Metadata</h1>

				<Card className="mb-6 p-6 grid gap-3">
					<NewMetaForm />
					<ContributorsForm />
				</Card>
				<Paginator
					query={await searchParams}
					nextLink="/dashboard/reviewer"
					backLink="/dashboard/attach-files"
				></Paginator>
			</main>
		</div>
	);
};
export default Page;
