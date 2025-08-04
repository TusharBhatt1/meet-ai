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
import { streamClient } from "@/lib/stream-client";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.auth;

    await streamClient.upsertUsers([
      {
        id: user.id,
        name: user.name,
        image:
          user.image ??
          createAvatar(initials, {
            seed: user.name,
            fontWeight: 700,
            fontSize: 42,
          }).toDataUri(),
      },
    ]);

    const expirationTime = Date.now() / 1000 + 3600; //1 hour
    const issueAt = Date.now() / 1000 - 60;

    const token = streamClient.generateUserToken({
      user_id: user.id,
      exp: expirationTime,
      validity_in_seconds: issueAt,
    });

    return token;
  }),
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
        .innerJoin(agents, eq(meetings.agentId, agents.id))
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
        page: z.number().max(MAX_PAGE_NUMBER).default(DEFAULT_PAGE_NUMBER),
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
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      const call = streamClient.video.call("default", createdMeeting.id);

      call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "720p",
            },
          },
        },
      });

      const [associatedAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!associatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Associated meeting agent not found.",
        });
      }

      await streamClient.upsertUsers([
        {
          name: associatedAgent.name,
          id: associatedAgent.id,
          role: "user",
          image: createAvatar(initials, {
            seed: associatedAgent.name,
            fontWeight: 700,
            fontSize: 42,
          }).toDataUri(),
        },
      ]);

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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedAgent] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!updatedAgent)
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      return { success: true, message: "Agent deleted !" };
    }),
});
