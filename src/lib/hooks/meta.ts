import { contributorFormSchema } from "@/schemas/upload"
import { useEffect, useState } from "react"
import { z } from "zod"

export const useMetadata = () => {
    const [metadatas, setMetadata] = useState<({ id: string } & z.infer<typeof contributorFormSchema>)[]>([])
    // useEffect(() => {
    //     fetch('/api/contributors')
    //         .then(res => res.json())
    //         .then(({ data }) => setMetadata(data))
    // }, [])

    return metadatas
}
