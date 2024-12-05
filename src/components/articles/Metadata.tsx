import React, { PropsWithChildren, use } from 'react'
import { contributors, db, metadata} from '@/db/schema'
import { eq } from 'drizzle-orm'
import { USER_ROLE } from '@/lib/roles'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default async function Metadata({ articleId, children }: { articleId: string, role: USER_ROLE } & PropsWithChildren) {

  const metas = await db
    .select()
    .from(metadata)
    .where(eq(metadata.articleId, articleId,))
    .limit(1)

  const meta = metas[0]
  const contibutors = await db
    .select()
    .from(contributors)
    .where(eq(contributors.articleId, articleId,))


  return (
    <article className="space-y-6">
      <div className="space-y-1 text-gray-600">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Article information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title of the journal</h3>
              <p className="mt-1">{meta.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Subtitle of the journal</h3>
              <p className="mt-1">{meta.subtitle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Abstract</h3>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: meta.abstract }} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Comments for the editor</h3>
              {children}
            </div>
          </CardContent>
        </Card>
    
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {contibutors.map(c => <li key={c.id}>{c.name}, {c.role}</li>)}
            </ul>
          </CardContent>
        </Card>
        
      </div>
    </article>
  )
}
