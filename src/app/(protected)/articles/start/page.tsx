import { Card, CardContent } from "@/components/ui/card";
import { ArticleTypeSection } from "@/components/upload/ArticleTypeSection";
import { CommentForEditor } from "@/components/upload/CommentForEditor";
import { Paginator } from "@/components/upload/Paginator";
import { SubmissionRequirementsSection } from "@/components/upload/SubmissionRequirementsSection";
const Page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ params: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	console.log("param object :", await params);
	console.log("query search param object :", await searchParams);
	const query = await searchParams;
	return (
				<Card>
					<CardContent className="p-6">
						<div className="space-y-8">
							<ArticleTypeSection />
							<SubmissionRequirementsSection />
							<div className="my-4 py-3">
								<h2 className="text-xl font-semibold mb-4">
									Comments for the editor
								</h2>
								<CommentForEditor />
							</div>
							<Paginator
								nextLink="/articles/attach-files"
								query={query}
							></Paginator>
						</div>
					</CardContent>
				</Card>
	);
};
export default Page;
