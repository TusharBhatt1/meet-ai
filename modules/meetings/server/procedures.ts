import { db } from "@/app/db";
import { meetings } from "@/app/db/schema";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_NUMBER,
  MAX_PAGE_SIZE,
} from "@/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, count, eq, ilike } from "drizzle-orm";
import z from "zod";
import { createMeetingSchema, updateMeetingSchema } from "../schema";

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
        pageNumber: z
          .number()
          .max(MAX_PAGE_NUMBER)
          .default(DEFAULT_PAGE_NUMBER),
        search: z.string().default(""),
      })
    )
    .query(async ({ input, ctx }) => {
      const { pageNumber, pageSize, search } = input;

      const allMeetings = await db
        .select()
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        )
        .limit(pageSize)
        .orderBy(asc(meetings.createdAt))
        .offset((pageNumber - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(eq(meetings.userId, ctx.auth.user.id));

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
