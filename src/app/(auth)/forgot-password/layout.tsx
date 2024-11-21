'use client'
import React, {  Suspense } from 'react'

const Layout:React.FC<Readonly<{
    children: React.ReactNode
  }>> = ({children}) => {
    return (
        <Suspense>
            {children}
        </Suspense>
    )
}

export default Layout