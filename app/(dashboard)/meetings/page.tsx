import MeetingsView from "@/modules/meetings/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading...</p>}>
        <MeetingsView />
      </Suspense>
    </HydrationBoundary>
  );
}
