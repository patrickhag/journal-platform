import Link from "next/link"
import { FileText, Users, LayoutDashboard, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold">
              JAEP
            </Link>
            <nav className="flex items-center gap-6">
              <Button variant="ghost" asChild>
                <Link
                  href="/articles"
                  className="flex items-center gap-2 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Articles
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href="/users"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </nav>
          </div>
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>
      {children}
    </>
  )
}

