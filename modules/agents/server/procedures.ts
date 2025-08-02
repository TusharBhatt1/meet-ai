import { db } from "@/app/db";
import { agents } from "@/app/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createAgentSchema } from "../schemas";
import z from "zod";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.userId));
      return agent;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE_NUMBER),
        pageSize: z
          .number()
          .max(MAX_PAGE_SIZE)
          .min(MIN_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const data = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);
      return { items: data, total: total, totalPages: totalPages };
    }),

  create: protectedProcedure
    .input(createAgentSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return {
        createdAgent,
        success: true,
        message: `${input.name} created !`,
      };
    }),
});
