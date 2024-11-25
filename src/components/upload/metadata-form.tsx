"use client"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { ContributorsForm,  } from "./ContributorsForm"
import { Paginator } from "./Paginator"
import { useCallback, useRef } from "react"
import { TNewJournal } from "@/lib/pages"
import { safeParse,  } from "zod-urlsearchparams"
import { z } from "zod"
import { contributorFormSchema } from "@/schemas/upload"
import { NewMetaForm } from "./NewMetaForm"

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


  const validation = safeParse({
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    }),
    input: new URLSearchParams(searchParams.toString()),
  })

  const form = useRef<HTMLFormElement>(null)
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <ProgressLine />

        <h1 className="mb-6 text-3xl font-bold">Metadata</h1>

        <Card className="mb-6 p-6 grid gap-3">
          <NewMetaForm form={form} />
          <ContributorsForm />
        </Card>
        <Paginator disabled={!validation.success} onBack={() => {
          router.push(`?${createQueryString("page", 'Attach files')}`)
        }} onNext={() => {
          form.current?.requestSubmit()
          if (form.current?.getAttribute('submited') === 'submited') {

          if (window) {
            location.href = location.origin + location.pathname + "?" + createQueryString("page", 'Reviewers')
          }
          }
          // NextJS issue https://github.com/vercel/next.js/discussions/9801, https://github.com/vercel/next.js/discussions/58940
          // router.push(`?${createQueryString("page", 'Reviewers')}`)
        }} />
      </main>
    </div>
  )
}
