import AgentsView, { AgentViewLoading } from "@/modules/agents/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page() {

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentViewLoading/>}>
           <AgentsView/>
        </Suspense>
    </HydrationBoundary>

}