import { Checkbox } from "./ui/checkbox"
import { useMetadata } from "@/lib/hooks/meta"

export const Contributors = () => {
    const contributors = useMetadata()

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
                {contributors.map((c) => (
                    <tr key={c.id} className="border-b">
                        <td className="py-2 pr-4">{c.name}</td>
                        <td className="py-2 pr-4">{c.homepage}</td>
                        <td className="py-2 pr-4">{c.role}</td>
                        <td className="py-2 pr-4">
                            <Checkbox id={`primary-${c.name}`} />
                        </td>
                        <td className="py-2">
                            <Checkbox id={`browse-${c.name}`} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
