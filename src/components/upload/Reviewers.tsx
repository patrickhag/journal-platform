import React, { FC } from 'react'
import { Avatar } from '../ui/avatar'
import { Edit2, Trash2, User } from 'lucide-react'
import { Button } from '../ui/button'
import { ReviewerFormValues } from './AddReviewerModal'

export const Reviewers: FC<{ reviewers: ReviewerFormValues[] }> = ({ reviewers }) => {
    return (
        <>
            {reviewers.map(({ affiliation, email, expertise, names }) => (
                <div key={email + names} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar>
                        <User className="w-5 h-5" />
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-medium">{names}</h4>
                        <p className="text-sm text-muted-foreground">{expertise}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <span className="bg-muted px-2 py-1 rounded text-sm">Reviewer</span>
                    </div>
                </div>
            ))}
        </>

    )
}
