import { newJournal } from '@/lib/pages'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export const ProgressLine = () => {
    const params = useSearchParams()
    const page = params.get('page')
    const journalKeys = Object.keys(newJournal)
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-4">
                {journalKeys.map((j, i) => (
                    <React.Fragment key={j}>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${i < journalKeys.indexOf(page ?? 'start')? "bg-blue-600" : "bg-blue-200"} text-white`}>
                            {i < journalKeys.indexOf(page ?? '') ? "✓" : i + 1}
                        </div>
                        <div className="text-blue-600">{j}</div>
                        {i < journalKeys.length -1 && <div className="h-px w-16 bg-gray-300"></div>}
                        
                    </React.Fragment>
                ))}
            </div>
        </div>

    )
}
