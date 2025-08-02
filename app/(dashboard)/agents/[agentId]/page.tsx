import AgentIdView, { AgentIdViewLoading } from "@/modules/agents/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  console.log(agentId)

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentIdViewLoading/>}>
        <AgentIdView agentId={agentId} />
      </Suspense>
    </HydrationBoundary>
  );
}
