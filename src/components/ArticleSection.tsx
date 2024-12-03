import { CommentPreview } from "./CommentPreview";
import { Card, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn, generateRandomBgColorForStatus } from "@/lib/utils";
import { TArticle } from "@/schemas/reviewer";


export function ArticleSection({ article: a, index: i }: {
  article: TArticle, index: number
}) {
  return <Card key={a.id}>
    <CardContent className="flex items-center justify-between p-6">
      <div className="flex items-start gap-6">
        <span className="text-xl font-medium text-muted-foreground">
          {(i + 1).toString().padStart(4, "0")}
        </span>
        <div className="space-y-1">
          <h3 className="font-medium uppercase">
            {a.section}
          </h3>
          <CommentPreview
            html={a.commentsForEditor}
          />
        <small className={cn(generateRandomBgColorForStatus(a.articleStatus || 'Draft'), "py-1 px-2 mt-2 rounded-full")}>{a.articleStatus || 'Draft'}</small>
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
          <DropdownMenuItem><Link href={`articles/${a.id}`}>View details</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href={a.fileURI || '#'}>Download PDF</Link></DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
}
