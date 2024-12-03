import React from 'react'
import Image from 'next/image'
import { auth } from '@/auth'
import { UserRound } from 'lucide-react'

const Header = async () => {
  const session = await auth()
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
    }
  }

  const names = session?.user?.name
    ?.split(' ')
    .map((name) => name.substring(0, 1))
    .join('')

  return (
    <>
      <div className='text-white text-center py-2 text-sm bg-gradient-to-r from-[#B8BCE4] to-[#737373]'>
        Free space for journal publication
      </div>

      <header className='flex items-center justify-between px-8 py-4 bg-gray-50 shadow'>
        <div className='text-xl font-bold flex items-center gap-2'>
          <div className='rounded-full'>
            <Image
              src='/jaep-logo.jpg'
              alt='Logo'
              width={32}
              height={32}
              className='rounded-full object-cover'
            />
          </div>
          Journal of African Epidemiology and Public Health
        </div>
        <nav className='flex gap-4 text-gray-700'>
          <a href='#' className='hover:text-blue-500'>
            Home
          </a>
          <a href='#' className='hover:text-blue-500'>
            About
          </a>
          <a href='#' className='hover:text-blue-500'>
            Articles
          </a>
          <a href='#' className='hover:text-blue-500'>
            Authors
          </a>
          <a href='#' className='hover:text-blue-500'>
            Reviewers
          </a>
        </nav>
        <div className='flex items-center gap-4'>
          <button
            className='text-white px-3 py-1 rounded hover:bg-blue-700'
            style={{ background: '#1A237E' }}
          >
            Submit a manuscript
          </button>
          {session?.user ? (
            <div className='bg-gray-400 rounded-full text-white'>
              <div className='px-1.5 py-1 text-sm'>{names}</div>
            </div>
          ) : (
            <UserRound size={20} />
          )}
        </div>
      </header>
    </>
  )
}
export default Header
