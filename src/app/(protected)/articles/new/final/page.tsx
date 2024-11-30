"use client";

import Spinner from "@/components/Spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { metadataSchema } from "@/components/upload/ContributorsForm";
import { Paginator } from "@/components/upload/Paginator";
import { submitAction } from "@/lib/submitionAction";
import {
  articleSubmitionSchema,
  filesSchema,
  finalSubmissionSchema,
  reviewerSchema,
} from "@/schemas/reviewer";
import { contributorFormSchema } from "@/schemas/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { RedirectType, redirect, useSearchParams } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as zu from "zod-urlsearchparams";
const Page = () => {
  const searchParams = useSearchParams();
  const [errorMessage, formAction, isPending] = useActionState(
    submitAction,
    undefined,
  );
  const form = useForm<z.infer<typeof finalSubmissionSchema>>({
    resolver: zodResolver(finalSubmissionSchema),
    defaultValues: {
      ethicalReference: "",
      founders: "",
    },
  });

  const others = searchParams.toString();
  if (!others) {
    redirect("/dashboard/start", RedirectType.push);
  }

  const metadataValidations = zu.safeParse({
    input: new URLSearchParams(others),
    schema: metadataSchema,
  });

  const reviewerValidations = zu.safeParse({
    input: new URLSearchParams(others),
    schema: z.object({
      reviewers: z.array(reviewerSchema),
    }),
  });
  const articleSubmitionValidations = zu.safeParse({
    input: new URLSearchParams(others),
    schema: articleSubmitionSchema,
  });
  const filesValidations = zu.safeParse({
    input: new URLSearchParams(others),
    schema: filesSchema,
  });
  const contributorValidations = zu.safeParse({
    input: new URLSearchParams(others),
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    }),
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const fm = new FormData();
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              fm.append(key, data[key as keyof typeof data] as string);
            }
          }
          fm.append(
            "metadataValidations",
            JSON.stringify(metadataValidations.data),
          );
          fm.append(
            "contributorValidations",
            JSON.stringify(contributorValidations.data?.contributors),
          );
          fm.append(
            "filesValidations",
            JSON.stringify(filesValidations.data?.files),
          );
          fm.append(
            "articleSubmitionValidations",
            JSON.stringify(articleSubmitionValidations.data),
          );
          fm.append(
            "reviewerValidations",
            JSON.stringify(reviewerValidations.data?.reviewers),
          );
          startTransition(() => {
            formAction(fm);
          });
        })}
        className="p-8 bg-white rounded-lg shadow-md"
      >
        {errorMessage?.message && (
          <Alert variant={"destructive"} className="my-4">
            {errorMessage?.message}
          </Alert>
        )}
        <h2 className="mb-4 text-xl font-semibold">Final submission</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="grid">
            <FormField
              control={form.control}
              name="funded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2">
                    Was this study funded?{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup className="flex space-x-4" {...field}>
                      <input
                        type="radio"
                        name="funded"
                        value="yes"
                        id="funded-yes"
                      />
                      <Label htmlFor="funded-yes">yes</Label>
                      <input
                        type="radio"
                        name="funded"
                        value="no"
                        id="funded-no"
                      />
                      <Label htmlFor="funded-no">no</Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="founders"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="If yes write the funding organization"
                      className="mt-2"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid">
            <FormField
              control={form.control}
              name="ethical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2">
                    Was this study given an ethical clearance?{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup className="flex space-x-4" {...field}>
                      <input
                        type="radio"
                        name="ethical"
                        value="yes"
                        id="ethical-yes"
                      />
                      <Label htmlFor="ethical-yes">yes</Label>
                      <input
                        type="radio"
                        name="ethical"
                        value="no"
                        id="ethical-no"
                      />
                      <Label htmlFor="ethical-no">no</Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ethicalReference"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="If yes write its reference number"
                      className="mt-2"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">
                  Has this study provided informed consent?
                </FormLabel>
                <FormControl>
                  <RadioGroup className="flex space-x-4" {...field}>
                    <input
                      type="radio"
                      name="consent"
                      value="yes"
                      id="consent-yes"
                    />
                    <Label htmlFor="consent-yes">yes</Label>
                    <input
                      type="radio"
                      name="consent"
                      value="no"
                      id="consent-no"
                    />
                    <Label htmlFor="consent-no">no</Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="human"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">
                  Has this study included Human part such as blood samples,
                  tissues? <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup className="flex space-x-4" {...field}>
                    <input
                      type="radio"
                      name="human"
                      value="yes"
                      id="human-yes"
                    />
                    <Label htmlFor="human-yes">yes</Label>
                    <input type="radio" name="human" value="no" id="human-no" />
                    <Label htmlFor="human-no">no</Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6">
          <Paginator backLink={`/articles/new/reviewer?${searchParams.toString()}`}>
            <Button disabled={isPending} className="bg-[#626EEF]">
              Submit {isPending && <Spinner />}
            </Button>
          </Paginator>
        </div>
      </form>
    </Form>
  );
};
export default Page;
