import { db, files } from "@/db/schema"
import { Button } from "../ui/button"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { USER_ROLES } from '@/lib/roles'
import withPermissions from "../WithPermission"
import ReviewModal from "./Review"
import { DeleteFile } from "./DeleteFile"

const FileControls = ({ publicId }: { publicId: string }) => <div className="space-x-1 flex">
  <ReviewModal/>
  <Button variant="link" className="text-blue-500 hover:text-blue-600">
    Update
  </Button>

  <DeleteFile publicId={publicId}/>
</div>

const UlterFile = withPermissions(FileControls)
async function Files({ articleId, role }: { articleId: string, role: typeof USER_ROLES[number] }) {
  const filesData = await db.select().from(files).where(eq(files.articleId, articleId))
  return (
    <>
      {filesData.map(f => (
        <div key={f.id} className="grid">
          <Link className="text-gray-600" href={f.publicId}>{f.originalName}</Link>
          <UlterFile requiredPermissions={['DELETE_OWN_ARTICLES', 'UPDATE_JOURNAL', 'CREATE_REVIEW']} role={role} fallback={<></>}  publicId={f.publicId}  />
        </div>
      ))}
    </>
  )
}

export default Files