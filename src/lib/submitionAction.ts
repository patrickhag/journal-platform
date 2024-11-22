"use server"
import { articleSubmissions, contributors, db, files, finalSubmissions, metadata, reviewers } from "@/db/schema"
import * as z from "zod"

const finalSubmissionSchema = z.object({
    funded: z.enum(["yes", "no"], {
        required_error: "Funding status is required",
    }).transform(val => val === "yes"),
    ethical: z.enum(["yes", "no"], {
        required_error: "Ethical clearance status is required",
    }).transform(val => val === "yes"),
    consent: z.enum(["yes", "no"], {
        required_error: "Informed consent status is required",
    }).transform(val => val === "yes"),
    human: z.enum(["yes", "no"], {
        required_error: "Human part inclusion status is required",
    }).transform(val => val === "yes"),
    founders: z.string().optional(),
    ethicalReference: z.string().optional()
})


export async function submitAction(_: unknown, formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    const result = finalSubmissionSchema.safeParse(data)

    if (!result.success) {
        console.error(result.error.errors)
        return
    }
    const metadataValidations = JSON.parse(data.metadataValidations.toString())
    const reviewerValidations = JSON.parse(data.reviewerValidations.toString())
    const articleSubmitionValidations = JSON.parse(data.articleSubmitionValidations.toString())
    const filesValidations = JSON.parse(data.filesValidations.toString())
    const contributorValidations = JSON.parse(data.contributorValidations.toString())

    try {
        await db.transaction(async (trx) => {
            await trx.insert(metadata).values(metadataValidations)
            await trx.insert(reviewers).values(reviewerValidations.reviewers)
            await trx.insert(articleSubmissions).values(articleSubmitionValidations)
            await trx.insert(files).values(filesValidations.files)
            await trx.insert(contributors).values(contributorValidations.contributors)
            await trx.insert(finalSubmissions).values(result.data)

            console.log({ message: "success" })
            return { message: "success" }
        })
    } catch (error) {
        console.error("Weeerror", error)
        return { message: "Failed to submit" }

    }

}

