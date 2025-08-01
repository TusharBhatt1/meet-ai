import { db } from "@/app/db";
import { agents } from "@/app/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { createAgentSchema } from "../schemas";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    //todo: make it protected
    getOne: protectedProcedure.input(z.object({
        userId: z.string()
    }))
        .query(async ({ input }) => {
            const [agent] = await db.select().from(agents).where(eq(agents.id, input.userId))
            return agent
        }),
    getMany: protectedProcedure.query(async () => {
        const data = await db.select().from(agents)
        return data
    }),
    create: protectedProcedure.input(createAgentSchema).mutation(async ({ input, ctx }) => {
        const [createdAgent] = await db.insert(agents).values({
            ...input,
            userId: ctx.auth.user.id
        }).returning()

        return { createdAgent, success: true, message:`${input.name} agent created !` }
    })
})