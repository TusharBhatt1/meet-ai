import { db } from "@/app/db";
import { agents } from "@/app/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agents)
        return data
    })
})