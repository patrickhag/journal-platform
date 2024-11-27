import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articleSubmissions, db, files } from "@/db/schema";
import { eq } from "drizzle-orm";
import {  MoreHorizontal, Search } from "lucide-react";
import { CommentPreview } from "./CommentPreview";
export default async function DashboardPannel() {
	const articles = await db
		.select()
		.from(articleSubmissions)
		.leftJoin(files, eq(articleSubmissions.id, files.articleId));
	const session = await auth();
	const currentUser = session?.user;

	return (
			<main className="container py-8 mx-auto">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold">
							Welcome back, {currentUser?.name}
						</h2>
						<p className="text-muted-foreground">
							You&apos;ve got {articles.length} submitted articles.
						</p>
					</div>

					<div className="flex items-center justify-end">
						<div className="relative w-72">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search an article..." className="pl-8" />
						</div>
					</div>

					<Tabs defaultValue="queues" className="w-full">
						<TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
							<TabsTrigger
								value="queues"
								className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
							>
								My Queues
							</TabsTrigger>
							<TabsTrigger
								value="archives"
								className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
							>
								Archives
							</TabsTrigger>
						</TabsList>
						<TabsContent value="queues" className="mt-6">
							<div className="grid gap-4">
								{articles.map((a, i) => (
									<Card key={a.article_submissions.id}>
										<CardContent className="flex items-center justify-between p-6">
											<div className="flex items-start gap-6">
												<span className="text-xl font-medium text-muted-foreground">
													{(i + 1).toString().padStart(4, "0")}
												</span>
												<div className="space-y-1">
													<h3 className="font-medium uppercase">
														{a.article_submissions.section}
													</h3>
													<CommentPreview
														html={a.article_submissions.commentsForEditor}
													/>
												</div>
											</div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">Open menu</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>View details</DropdownMenuItem>
													<DropdownMenuItem>Download PDF</DropdownMenuItem>
													<DropdownMenuItem>Share</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
						<TabsContent value="archives" className="mt-6">
							<div className="text-center text-muted-foreground">
								No archived articles found.
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</main>
	);
}
