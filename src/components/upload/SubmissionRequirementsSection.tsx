import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import { useCallback } from "react"

const checkboxGroup = [{
    id: "requirement1",
    text: "The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor)."
}, {
    id: "requirement2",
    text: "The submission file is in OpenOffice, Microsoft Word, or RTF document file format."
}, {
    id: "requirement3",
    text: "Where available, URLs for the references have been provided."
}, {
    id: "requirement4",
    text: "The text is single-spaced; uses a 12-point font; employs italics, rather than underlining (except with URL addresses); and all illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end."
}, {
    id: "requirement5",
    text: "The text adheres to the stylistic and bibliographic requirements outlined in the Author Guidelines."
}]

export const SubmissionRequirementsSection = () => {
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
            <h2 className="text-xl font-semibold mb-4">
                Submission requirements
            </h2>
            <p className="text-gray-600 mb-4">
                You must read and acknowledge that you&apos;ve completed the
                requirements below before proceeding.
            </p>
            <div className="space-y-4">
                {checkboxGroup.map((c) => (
                    <div key={c.id} className="flex items-start space-x-3">
                        <Checkbox id={c.id} value={c.id} onCheckedChange={e => {
                            router.push(`?${createQueryString(c.id, e ? 'true' : 'false')}`)
                        }} />
                        <label
                            htmlFor={c.id}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {c.text}
                        </label>
                    </div>
                ))}
                {/* <div className="flex items-start space-x-3">
                    <Checkbox id="requirement1" />
                    <label
                        htmlFor="requirement1"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        The submission has not been previously published, nor is it
                        before another journal for consideration (or an explanation
                        has been provided in Comments to the Editor).
                    </label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="requirement2" />
                    <label
                        htmlFor="requirement2"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        The submission file is in OpenOffice, Microsoft Word, or RTF
                        document file format.
                    </label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="requirement3" />
                    <label
                        htmlFor="requirement3"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Where available, URLs for the references have been provided.
                    </label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="requirement4" />
                    <label
                        htmlFor="requirement4"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        The text is single-spaced; uses a 12-point font; employs
                        italics, rather than underlining (except with URL addresses);
                        and all illustrations, figures, and tables are placed within
                        the text at the appropriate points, rather than at the end.
                    </label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="requirement5" />
                    <label
                        htmlFor="requirement5"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        The text adheres to the stylistic and bibliographic
                        requirements outlined in the Author Guidelines.
                    </label>
                </div> */}
            </div>
        </div>
    )
}

