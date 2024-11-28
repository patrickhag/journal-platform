import { Card } from "@/components/ui/card";
import { ContributorsForm } from "@/components/upload/ContributorsForm";
import { NewMetaForm } from "@/components/upload/NewMetaForm";
import { Paginator } from "@/components/upload/Paginator";

const Page = async ({
	searchParams,
}: {
	params: Promise<{ params: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	return (
		<>
			<h1 className="mb-6 text-3xl font-bold">Metadata</h1>

			<Card className="mb-6 p-6 grid gap-3">
				<NewMetaForm />
				<ContributorsForm />
			</Card>
			<Paginator
				query={await searchParams}
				nextLink="/articles/reviewer"
				backLink="/articles/attach-files"
			></Paginator>
		</>
	);
};
export default Page;
