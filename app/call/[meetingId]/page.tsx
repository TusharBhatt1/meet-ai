import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import CallView, { CallViewLoading } from "@/modules/call/views/call-view";

export default async function Page({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const { meetingId } = await params;

  const queryClient = getQueryClient();

  queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CallViewLoading />}>
        <CallView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  );
}
