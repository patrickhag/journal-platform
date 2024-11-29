import React from 'react'
import { Button } from '../ui/button'
import { contributors, db, metadata, reviewers, } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { USER_ROLE } from '@/lib/roles'
import withPermissions from '../WithPermission'

export default async function Metadata({ articleId, role }: { articleId: string, role: USER_ROLE  }) {

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
  const reviewrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.articleId, articleId,))


  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-900">{meta.prefix} {meta.title}</h1>

      <div className="space-y-1 text-gray-600">
        <p>{meta.subtitle}</p>
        <p>Authors: {contibutors.filter(c => c.role === '').map(c => <Link key={c.id} href={`/articles/${articleId}?contributor=${c.id}`}>{c.name}</Link>)}</p>
        <p>Contibutors: {contibutors.map(c => <Link key={c.id} href={`/articles/${articleId}?contributor=${c.id}`}>{c.name} </Link>)}</p>
        <p>Reviewed by: {reviewrs.map(c => <Link key={c.id} href={`/articles/${articleId}?reviewer=${c.id}`}>{c.names}</Link>)}</p>
      </div>
      <UpdateMetaDataWithPermissions requiredPermissions={['UPDATE_JOURNAL']} role={role} fallback={<></>}/>
      <div className="space-y-4 text-gray-600" dangerouslySetInnerHTML={{ __html: meta.abstract }}>
      </div>
    </article>
  )
}

function UpdateMetaData() {

  return <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
    Update
  </Button>
}

const UpdateMetaDataWithPermissions = withPermissions(UpdateMetaData)