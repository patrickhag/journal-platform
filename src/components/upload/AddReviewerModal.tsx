'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { reviewerSchema } from "@/schemas/reviewer"
import { startTransition, useActionState } from "react"
import { addReviewer } from "@/lib/actions"

export type ReviewerFormValues = z.infer<typeof reviewerSchema>

interface AddReviewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ReviewerFormValues) => void
}

export default function AddReviewerModal({ open, onOpenChange, onSubmit }: AddReviewerModalProps) {
  const form = useForm<ReviewerFormValues>({
    resolver: zodResolver(reviewerSchema),
    defaultValues: {
      names: "",
      affiliation: "",
      email: "",
      phone: "",
      expertise: "",
    },
  })

  const [errorMessage, formAction, isPending] = useActionState(
    addReviewer,
    undefined,
);


  function handleSubmit(data: ReviewerFormValues) {
    startTransition(() => {
      formAction(data);
      onSubmit(data)
      form.reset()
      onOpenChange(false)
  });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reviewer</DialogTitle>
          <p className="text-sm text-muted-foreground">* Denotes a required field</p>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Names *</FormLabel>
                  <FormControl>
                    <Input placeholder="Full names of the contributor" {...field}/>
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
                    <Input type="email" placeholder="Email" {...field}  />
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}