import React from 'react'

export const ProgressLine = () => {
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    ✓
                </div>
                <div className="text-blue-600">Start</div>
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    2
                </div>
                <div className="text-gray-500">Attach files</div>
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    3
                </div>
                <div className="text-gray-500">Enter metadata</div>
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    4
                </div>
                <div className="text-gray-500">Reviewers</div>
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    5
                </div>
                <div className="text-gray-500">Final submit</div>
            </div>
        </div>

    )
}
