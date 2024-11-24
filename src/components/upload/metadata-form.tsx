import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { ContributorsForm, metadataSchema } from "./ContributorsForm"
import { Paginator } from "./Paginator"
import { useCallback } from "react"
import { TNewJournal } from "@/lib/pages"
import { safeParse } from "zod-urlsearchparams"
import { z } from "zod"
import { contributorFormSchema } from "@/schemas/upload"

export default function MetadataForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
      (name: string, value: TNewJournal) => {
          const prs = new URLSearchParams(searchParams.toString());
          prs.set(name, value);
          return prs.toString();
      },
      [searchParams])

      const parsedData = safeParse({
        input: new URLSearchParams(searchParams.toString()),
        schema: metadataSchema,
    })
    const validation = safeParse({
      schema: z.object({
          contributors: z.array(contributorFormSchema),
      }),
      input: new URLSearchParams(searchParams.toString()),
  })

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <ProgressLine />

        <h1 className="mb-6 text-3xl font-bold">Metadata</h1>

        <Card className="mb-6 p-6">
          <ContributorsForm />
        </Card>
        <Paginator disabled={!(parsedData.success && validation.success)} onBack={() => {
          router.push(`?${createQueryString("page", 'Attach files')}`)
        }} onNext={() => {
          router.push(`?${createQueryString("page", 'Reviewers')}`)
        }} />
      </main>
    </div>
  )
}
