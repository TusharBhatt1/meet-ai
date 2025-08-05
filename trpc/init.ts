import { db } from "@/app/db";
import { agents, meetings } from "@/app/db/schema";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/constants";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { TRPCError, initTRPC } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in for this.",
    });

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = (entity: "agents" | "meetings") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const [meetingsCount] = await db
      .select({ count: count(meetings.id) })
      .from(meetings)
      .where(eq(meetings.id, ctx.auth.user.id));

    const [agentsCount] = await db
      .select({ count: count(agents.id) })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const isSubscribedUser = customer.activeSubscriptions.length > 0;

    const noFreeMeetingsLeft =
      entity === "meetings" &&
      !isSubscribedUser &&
      meetingsCount.count >= MAX_FREE_MEETINGS;

    const noFreeAgentsLeft =
      entity === "agents" &&
      !isSubscribedUser &&
      agentsCount.count >= MAX_FREE_AGENTS;

    if (noFreeMeetingsLeft) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum free meetings limit",
      });
    }

    if (noFreeAgentsLeft) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum free agents limit",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  });
