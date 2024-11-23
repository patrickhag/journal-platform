"use client"
import { newJournal, TNewJournal } from "@/lib/pages"
import { useSearchParams } from "next/navigation"

export default function Upload() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') as TNewJournal | null
  const Component = (page: TNewJournal) => {
    return newJournal[page]
  }
  return Component(page || 'start')
}
