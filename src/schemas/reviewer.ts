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
