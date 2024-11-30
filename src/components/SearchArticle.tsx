import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { redirect } from "next/navigation";
export const SearchArticle = async () => {
  return (
    <form className="flex items-center justify-end" action={async formData => {
      "use server"
      console.log(formData)
      redirect(`/dashboard?q=${formData.get('q')}`)
    }}>
      <div className="relative w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search an article..." className="pl-8" name="q" />
      </div>
    </form>

  )
}
