import { LoadingState } from "@/components/loading-state";
import MeetingsHeader from "@/modules/meetings/components/meetings-header";
import MeetingsView from "@/modules/meetings/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className="space-y-7">
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MeetingsHeader />
      <Suspense fallback={<LoadingState />}>
        <MeetingsView />
      </Suspense>
    </HydrationBoundary>
    </div>
  );
}
