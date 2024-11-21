import React, { FC } from 'react'
import { Button } from '../ui/button'

export const Paginator:FC<{onNext: ()=> void}> = ({onNext}) => {
    return (
        <>
            <p className="mb-4 text-sm text-gray-500">* Denotes a required field</p>

            <div className="flex justify-between">
                <Button variant="outline">Go back</Button>
                <Button onClick={onNext}>Continue</Button>
            </div>
        </>
    )
}
