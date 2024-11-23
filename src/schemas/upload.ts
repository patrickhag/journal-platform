import { COUNTRIES, SALUTATION } from "@/lib/consts";
import { z } from "zod";

export const contributorFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    salutation: z.enum(SALUTATION, { message: "Salutation is required." }),
    country: z.enum(COUNTRIES, { message: "Country is required." }),
    homepage: z.string().url().optional().or(z.literal("")),
    orcid: z.string().optional(),
    affiliation: z.string().min(2, { message: "Affiliation is required." }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
    role: z.enum(["author", "translator"], {
        required_error: "Please select a role.",
    }),
})
