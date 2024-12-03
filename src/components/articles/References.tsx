import { db, finalSubmissions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

export default async function References({ articleId }: { articleId: string }) {
  const references = await db.select({
    ethicalReference: finalSubmissions.ethicalReference
  }).from(finalSubmissions).where(eq(finalSubmissions.articleId, articleId)).limit(1)
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-900">References</h2>
      {references.length <= 0 ? 'no references given!' :
        <p className="text-gray-600">
          {references[0].ethicalReference}
        </p>
      }
    </section>
  )
}

