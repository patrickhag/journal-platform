import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import AddReviewerModal from "@/components/upload/AddReviewerModal";
import { Paginator } from "@/components/upload/Paginator";
import { ProgressLine } from "@/components/upload/Progress";
import { ReviewCard } from "@/components/upload/ReviewCard";
import { Reviewers } from "@/components/upload/Reviewers";
import { Bell, User } from "lucide-react";

const Page = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	console.log("query search param object :", await searchParams);
	const query = await searchParams;
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="flex h-16 items-center px-4 gap-4 container">
					<h1 className="text-xl font-semibold">
						Journal of African Epidemiology and Public health
					</h1>
					<div className="ml-auto flex items-center gap-4">
						<Button variant="ghost" size="icon">
							<Bell className="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon">
							<User className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</header>

			<div className="flex">
				<Sidebar />
				<main className="flex-1 p-6">
					<div className="space-y-8">
						<ProgressLine />

						<div className="space-y-6">
							<h2 className="text-2xl font-semibold tracking-tight">
								Reviewers
							</h2>
							<ReviewCard />
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Proposed reviewers list</h3>

								<div className="space-y-4">
									<Reviewers />
								</div>

								<AddReviewerModal />
								<Paginator
									backLink="/dashboard/meta"
									nextLink="/dashboard/final"
									query={query}
								></Paginator>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};
export default Page;
