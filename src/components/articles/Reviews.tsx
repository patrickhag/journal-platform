import { USER_ROLE } from '@/lib/roles'
import React from 'react'
import { Button } from '../ui/button'
import withPermissions from '../WithPermission'

const Reviews = ({ role }: { role: USER_ROLE }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-gray-600">
                        Lorem ipsum article has been posted has been posted has been posted
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">spider man</span>
                        <ControlReviewsWithPermissions role={role} requiredPermissions={['MANAGE_REVIEWS']} fallback={<></>} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Reviews

const ReviewersControl = () => <div className="space-x-2">
    <Button variant="link" className="text-blue-500 hover:text-blue-600">
        Hide
    </Button>
    <Button variant="link" className="text-red-500 hover:text-red-600">
        Delete
    </Button>
</div>

const ControlReviewsWithPermissions = withPermissions(ReviewersControl)