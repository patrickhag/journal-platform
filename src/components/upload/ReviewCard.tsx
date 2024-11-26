import { Card, CardContent } from "../ui/card";

export function ReviewCard() {
	return (
		<Card>
			<CardContent className="p-6 space-y-4">
				<h3 className="font-medium">
					When suggesting reviewers or editors for your submission, please
					include:
				</h3>
				<ul className="space-y-4">
					<li className="flex gap-3">
						<span className="mt-1">•</span>
						<p>
							Full Name: Provide the full name, and affiliation to ensure we
							identify the correct person.
						</p>
					</li>
					<li className="flex gap-3">
						<span className="mt-1">•</span>
						<p>
							Expertise and Relevance: Briefly describe why this individual is
							suitable to review your work, emphasizing their expertise or
							familiarity with your research topic.
						</p>
					</li>
					<li className="flex gap-3">
						<span className="mt-1">•</span>
						<p>
							Contact Information: If possible, provide an email address or
							other contact details to facilitate the review process.
						</p>
					</li>
				</ul>
				<p className="text-muted-foreground">
					Your recommendations help us select reviewers who are knowledgeable
					and impartial, enhancing the quality of the review process.
				</p>
			</CardContent>
		</Card>
	);
}
