import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useCallback } from "react"

export const ArticleTypeSection = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback<(name: string, value: string) => string>(
        (name: string, value: string) => {
            const prs = new URLSearchParams(searchParams.toString());
            prs.set(name, value);
            return prs.toString();
        },
        [searchParams])

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Article type</h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2">
                        Section type <span className="text-red-500">*</span>
                    </label>
                    <Select defaultValue="original-research" onValueChange={e => {
                        router.push(`?${createQueryString("section", e)}`)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="original-research">
                                Original research
                            </SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="case-study">Case Study</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
