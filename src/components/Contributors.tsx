import { useEffect } from "react"
import { Checkbox } from "./ui/checkbox"

async function getContributors(){
    const req = await fetch('/api/contributors')
    const res = await req.text()
    return res

}

export const Contributors = () => {
   useEffect(() => {
         getContributors().then(console.log)
   }, [])

    return (
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
    )
}
