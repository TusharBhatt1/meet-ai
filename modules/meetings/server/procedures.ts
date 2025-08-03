import { db } from "@/app/db";
import { agents, meetings } from "@/app/db/schema";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_NUMBER,
  MAX_PAGE_SIZE,
} from "@/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, count, eq, ilike, getTableColumns, sql } from "drizzle-orm";
import z from "zod";
import { createMeetingSchema, updateMeetingSchema } from "../schema";
import { MeetingStatus } from "../types";

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!meeting)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found !",
        });

      return { meeting, success: true };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        page: z
          .number()
          .max(MAX_PAGE_NUMBER)
          .default(DEFAULT_PAGE_NUMBER),
        search: z.string().default(""),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus["Upcoming"],
            MeetingStatus["Active"],
            MeetingStatus["Completed"],
            MeetingStatus["Processing"],
            MeetingStatus["Cancelled"],
          ])
          .nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search, agentId, status } = input;

      const allMeetings = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          //TO LEARN
          duration:
            sql<number>`EXTRACT(EPOCH FROM ("ended_at"-"started_at"))`.as(
              "duration"
            ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined
          )
        )
        .limit(pageSize)
        .orderBy(asc(meetings.createdAt))
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined
          )
        );

      return {
        total,
        items: allMeetings,
        totalPages: Math.ceil(total.count / pageSize),
      };
    }),

  create: protectedProcedure
    .input(createMeetingSchema)
    .mutation(async ({ input, ctx }) => {
      const createdMeeting = await db.insert(meetings).values({
        ...input,
        userId: ctx.auth.user.id,
      });

      return {
        createdMeeting,
        success: true,
        message: `${input.name} created !`,
      };
    }),

  update: protectedProcedure
    .input(updateMeetingSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedAgent] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!updatedAgent)
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      return { success: true, message: "Agent updated !" };
    }),
});
