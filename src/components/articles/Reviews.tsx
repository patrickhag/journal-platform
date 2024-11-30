import { USER_ROLE } from '@/lib/roles'
import React from 'react'
import { Button } from '../ui/button'
import withPermissions from '../WithPermission'
import { db, reviews, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

const Reviews = async ({ role,articleId }: { role: USER_ROLE, articleId: string }) => {
const reviewerReviews = await db.select().from(reviews).where(eq(reviews.articleId,articleId))
    return (
        <div className="space-y-4">
            {reviewerReviews.map((r) => (
                <div key={r.id} className="space-y-2">
                    <p className="text-gray-600">{r.message}</p>
                    <h3 className='font-bold text-xl'>Files</h3>
                    <ul>
                        {r.fileIds.map((f, i) => <li key={f}><a href={f}>{i+1}. {f.split('/').at(-1)}</a></li>)}
                    </ul>
                    <div className="flex items-center justify-between">
                        <User id={r.userId}/>
                        <ControlReviewsWithPermissions role={role} requiredPermissions={['MANAGE_REVIEWS']} fallback={<></>} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Reviews

const User = async({id}:{id: string})=>{
  
const user = await db.select({
    firstName: users.firstName,
    lastName: users.lastName
}).from(users).where(eq(users.id, id)).limit(1)
return <span className="text-sm text-gray-500">{user[0].firstName} {user[0].lastName}</span>

}

const ReviewersControl = () => <div className="space-x-2">
    <Button variant="link" className="text-blue-500 hover:text-blue-600">
        Hide
    </Button>
    <Button variant="link" className="text-red-500 hover:text-red-600">
        Delete
    </Button>
</div>

const ControlReviewsWithPermissions = withPermissions(ReviewersControl)