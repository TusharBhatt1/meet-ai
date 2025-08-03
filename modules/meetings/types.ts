import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"]["meeting"];

export type MeetingGetMany =
inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]