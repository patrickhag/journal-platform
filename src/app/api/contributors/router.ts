import { contributors, db } from "@/db/schema";

export async function GET(request: Request) {
    try {
        const contributor = await db.select().from(contributors)
        return Response.json(contributor)
    } catch (error: any) {
        return Response.json("Error: " + error.message)
    }
}
