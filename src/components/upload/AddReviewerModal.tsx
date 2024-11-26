"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { reviewerSchema } from "@/schemas/reviewer";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { safeParse, serialize } from "zod-urlsearchparams";

type ReviewerFormValues = z.infer<typeof reviewerSchema>;

export default function AddReviewerModal() {
	const form = useForm<ReviewerFormValues>({
		resolver: zodResolver(reviewerSchema),
		defaultValues: {
			names: "",
			affiliation: "",
			email: "",
			phone: "",
			expertise: "",
		},
	});
	const router = useRouter();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState(false);
	const reviewersValidation = safeParse({
		schema: z.object({
			reviewers: z.array(reviewerSchema),
		}),
		input: new URLSearchParams(searchParams.toString()),
	});

	const reviewers = reviewersValidation.data?.reviewers || [];

	function handleSubmit(data: ReviewerFormValues) {
		reviewers.push(data);
		const serializedData = serialize({
			data: { reviewers },
			schema: z.object({
				reviewers: z.array(reviewerSchema),
			}),
		});

		const params = new URLSearchParams(searchParams.toString());

		params.delete("reviewers");
		router.push(`?${params.toString()}&${serializedData.toString()}`);
		form.reset();
		setOpen(false);
	}

	return (
		<>
			<Button onClick={() => setOpen(true)}>Add reviewer</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Reviewer</DialogTitle>
						<p className="text-sm text-muted-foreground">
							* Denotes a required field
						</p>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="names"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Names *</FormLabel>
										<FormControl>
											<Input
												placeholder="Full names of the contributor"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="affiliation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Affiliation *</FormLabel>
										<FormControl>
											<Input placeholder="e.g: Organisation" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input type="email" placeholder="Email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone number</FormLabel>
										<FormControl>
											<Input placeholder="Phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="expertise"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Expertise or Relevance *</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Briefly describe why this individual is suitable to review your work"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-end gap-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit">Add</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
