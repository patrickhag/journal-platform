import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type ARTICLE_STATUS } from '@/lib/consts'

export function StatusBadge({ status }: { status: typeof ARTICLE_STATUS[number] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full",
        {
          "bg-blue-50 text-blue-600 border-blue-600/20": status === "Submitted",
          "bg-green-50 text-green-600 border-green-600/20": status === "Approved",
          "bg-red-50 text-red-600 border-red-600/20": status === "Rejected",
          "bg-yellow-50 text-yellow-600 border-yellow-600/20": status === "Incomplete",
          "bg-purple-50 text-purple-600 border-purple-600/20": status === "Finalized",
        }
      )}
    >
      <span className={cn("mr-1 h-1.5 w-1.5 rounded-full", {
        "bg-blue-600": status === "Submitted",
        "bg-green-600": status === "Approved",
        "bg-red-600": status === "Rejected",
        "bg-yellow-600": status === "Incomplete",
        "bg-purple-600": status === "Finalized",
      })} />
      {status}
    </Badge>
  )
}

