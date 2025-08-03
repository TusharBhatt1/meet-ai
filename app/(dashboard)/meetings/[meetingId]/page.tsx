import MeetingIdView, {
  MeetingIdViewLoading,
} from "@/modules/meetings/components/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;

  const queryClient = getQueryClient();

  queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <MeetingIdView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  );
}
