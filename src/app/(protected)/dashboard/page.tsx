import DashboardPannel from "@/components/Dashboard";
import { articleSubmissions,  db, files } from "@/db/schema";
import { eq } from "drizzle-orm";


export default async function Dashboard() {
 const articles = await db.select().from(articleSubmissions).leftJoin(files, eq(articleSubmissions.id, files.articleId))

 return <DashboardPannel />
  }

