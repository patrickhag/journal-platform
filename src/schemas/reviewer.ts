import { requirementsCheckboxGroup } from "@/lib/consts";
import { z } from "zod";

export const reviewerSchema = z.object({
  names: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  affiliation: z.string().min(2, {
    message: "Affiliation must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  expertise: z.string().min(10, {
    message: "Please provide more detail about the reviewer's expertise.",
  }),
})


export const articleSubmitionSchema = z.object({
  section: z.string(),
  requirements: z.array(z.string()).length(requirementsCheckboxGroup.length),
  'Comments for the editor': z.string()
})

const fileSchema = z.object(
  {
    publicId: z.string(),
    fileType: z.string().optional(),
    resourceType: z.string(),
    originalName: z.string()
  }
)
export const filesSchema = z.object({
  files: z.array(fileSchema)
})

export type TFile = (z.infer<typeof fileSchema>)