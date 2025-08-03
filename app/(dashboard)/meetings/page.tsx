import { LoadingState } from "@/components/loading-state";
import MeetingsHeader from "@/modules/meetings/components/meetings-header";
import { loadSearchParams } from "@/modules/meetings/hooks/useServerMeetingsParams";
import MeetingsView from "@/modules/meetings/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const queryClient = getQueryClient();
  const filters = await loadSearchParams(searchParams);
  queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions(filters));

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
