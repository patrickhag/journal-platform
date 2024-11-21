import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, LayoutDashboard, FileText, LogOut } from 'lucide-react'
import { redirect } from "next/navigation"

export default function MetadataForm() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold">Journal of African Epidemiology and Public health</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <FileText className="h-5 w-5" />
            <span>Articles</span>
          </a>
        </nav>
        <div className="absolute bottom-4 left-4">
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="mb-8 flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">✓</div>
            <div className="text-blue-600">Start</div>
            <div className="h-px w-16 bg-blue-600"></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">✓</div>
            <div className="text-blue-600">Attach files</div>
            <div className="h-px w-16 bg-blue-600"></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">3</div>
            <div className="text-blue-600">Enter metadata</div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">4</div>
            <div className="text-gray-500">Reviewers</div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">5</div>
            <div className="text-gray-500">Final submit</div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-500" />
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        </div>

        <h1 className="mb-6 text-3xl font-bold">Metadata</h1>

        <Card className="mb-6 p-6">
          <form>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prefix">Prefix *</Label>
                <Input id="prefix" placeholder="A, the" />
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Title of the journal" />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input id="subtitle" placeholder="Subtitle of the journal" />
            </div>
            <div className="mb-4">
              <Label htmlFor="abstract">Abstract *</Label>
              <Textarea id="abstract" placeholder="Abstract of the journal" rows={4} />
            </div>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Contributors</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">Email</th>
                      <th className="pb-2 pr-4">Role</th>
                      <th className="pb-2 pr-4">Primary contact</th>
                      <th className="pb-2">In browse lists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2].map((index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 pr-4">Peter pan</td>
                        <td className="py-2 pr-4">peterpan@gmail.com</td>
                        <td className="py-2 pr-4">Author</td>
                        <td className="py-2 pr-4">
                          <Checkbox id={`primary-${index}`} />
                        </td>
                        <td className="py-2">
                          <Checkbox id={`browse-${index}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4">
                Add contributor
              </Button>
            </div>
          </form>
        </Card>

        <p className="mb-4 text-sm text-gray-500">* Denotes a required field</p>

        <div className="flex justify-between">
          <Button variant="outline" onClick={()=>{
            redirect(`/dashboard/upload?page=uploads`)
          }}>Go back</Button>
          <Button>Continue</Button>
        </div>
      </main>
    </div>
  )
}