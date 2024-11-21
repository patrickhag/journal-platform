import { z } from "zod";

export const contributorFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    salutation: z.string().min(2, { message: "Salutation is required." }),
    country: z.string().min(1, { message: "Please select a country." }),
    homepage: z.string().url().optional().or(z.literal("")),
    orcid: z.string().optional(),
    affiliation: z.string().min(2, { message: "Affiliation is required." }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
    role: z.enum(["author", "translator"], {
        required_error: "Please select a role.",
    }),
})
