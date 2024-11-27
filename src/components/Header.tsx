import React from 'react'
import { Button } from './ui/button'
import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
	<header className="border-b">
				<div className="flex h-16 items-center px-4 gap-4 ">
					<h1 className="text-xl font-semibold">
						Journal of African Epidemiology and Public health
					</h1>
					<div className="ml-auto flex items-center gap-4">
						<Button variant="ghost" size="icon">
							<Bell
              className="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon">
							<User className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</header>

  )
}

