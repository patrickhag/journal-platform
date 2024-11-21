import React from 'react'
import { Button } from '../ui/button'
import { redirect } from 'next/navigation'

export const Paginator = () => {
    return (
        <>
            <p className="mb-4 text-sm text-gray-500">* Denotes a required field</p>

            <div className="flex justify-between">
                <Button variant="outline">Go back</Button>
                <Button onClick={() => {
                    redirect(`/dashboard/upload?page=meta-data`)
                }}>Continue</Button>
            </div>
        </>
    )
}
