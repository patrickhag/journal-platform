import { db, files } from "@/db/schema"
import { Button } from "../ui/button"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { FileText } from "lucide-react"

async function Files({ articleId}: { articleId: string}) {
  const filesData = await db.select().from(files).where(eq(files.articleId, articleId))
  return (
    <>
    <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Article Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filesData.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.originalName}</p>
                    <p className="text-sm text-muted-foreground">{file.publicId.split('.').at(-1)} | 12kb</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Link href={file.publicId} download>
                  Download
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
     
    </>
  )
}

export default Files