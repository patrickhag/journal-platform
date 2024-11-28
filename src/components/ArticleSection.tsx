import { TArticleSubmissions } from "@/db/schema";
import { CommentPreview } from "./CommentPreview";
import { Card, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

export function ArticleSection({ article: a, index: i }: { article: TArticleSubmissions, index: number }) {
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
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Download PDF</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
}
