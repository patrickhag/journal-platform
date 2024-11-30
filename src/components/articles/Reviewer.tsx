import { db, reviewers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

export default async function Reviewer({ reviewer }: { reviewer: string }) {
  const reviewerrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.id, reviewer,))
    .limit(1)
  const reviewerData = reviewerrs[0]
  return (
    <div className="space-y-2 text-gray-600">
      <p>Names: {reviewerData.names}</p>
      {reviewerData.phone && <p>phone: {reviewerData.phone}</p>}
      <p>Email: {reviewerData.email}</p>
      <p>{reviewerData.expertise}</p>
    </div>
  )
}

