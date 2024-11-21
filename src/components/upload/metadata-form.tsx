import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Sidebar } from "../Sidebar"
import { ProgressLine } from "./Progress"
import { ContributorsForm } from "./ContributorsForm"
import { Paginator } from "./Paginator"
import { useQueryString } from "@/lib/hooks/useQueryString"

export default function MetadataForm() {
  const createQueryString = useQueryString()
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <ProgressLine />

        <h1 className="mb-6 text-3xl font-bold">Metadata</h1>

        <Card className="mb-6 p-6">
          <ContributorsForm />
        </Card>
        <Paginator onNext={() => {
          router.push(`?${createQueryString("page", 'uploads')}`)
        }} />
      </main>
    </div>
  )
}
