import { auth } from "@/lib/auth";
import AgentsHeader from "@/modules/agents/views/agents-header";
import AgentsView, {
  AgentsViewLoading,
} from "@/modules/agents/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { loadSearchParams } from "@/modules/agents/hooks/useServerAgentsParams";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();

  const filters = await loadSearchParams(searchParams);

  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions(filters));

  return (
    <div className="space-y-7">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AgentsHeader />
        <Suspense fallback={<AgentsViewLoading />}>
          <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
