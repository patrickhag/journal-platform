import React, { FC } from 'react'
import { Button } from '../ui/button'

export const Paginator: FC<{ onNext?: () => void, onBack?: () => void, disabled?:boolean }> = ({ onNext, onBack,disabled }) => {
    return (
        <div>
            <p className="mb-4 text-sm text-gray-500">* Denotes a required field</p>

            <div className="flex justify-between">
                {onBack && <Button type='button' variant="outline" onClick={onBack}>Go back</Button>}
                {onNext && <Button type='button' onClick={onNext} disabled={disabled}>Continue</Button>}
            </div>
        </div>
    )
}
