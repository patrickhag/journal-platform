
import { contributors, db, } from '@/db/schema'
import { USER_ROLE, } from '@/lib/roles'
import { eq } from 'drizzle-orm'
import React from 'react'
import { Button } from '../ui/button'
import withPermissions from '../WithPermission'

export default async function Contributor({ contributor, role }: { contributor: string, role: USER_ROLE }) {
  const reviewerrs = await db
    .select()
    .from(contributors)
    .where(eq(contributors.id, contributor,))
    .limit(1)
  const contributorData = reviewerrs[0]
  return (
    <div className="space-y-2 text-gray-600">
      <p>Names: {contributorData.salutation} {contributorData.name}</p>
      <div>{contributorData.bio}</div>
      {contributorData.homepage && <p>homepage: <a href={contributorData.homepage}>{contributorData.homepage}</a></p>}
      <p>Country: {contributorData.country}</p>
      <p>{contributorData.affiliation}</p>
      <RemoveContributorWithPermissions requiredPermissions={['DELETE_CONTRIBUTOR']} role={role} fallback={<></>}/>
    </div>
  )
}

const RemoveContributor = () => <Button>Remove</Button>
const RemoveContributorWithPermissions = withPermissions(RemoveContributor)