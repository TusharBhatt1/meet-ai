import { auth } from "@/lib/auth";
import AgentsHeader from "@/modules/agents/views/agents-header";
import AgentsView, { AgentViewLoading } from "@/modules/agents/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function Page() {

    const session = await auth.api.getSession({
        headers:await headers()
    })

    if(!session) redirect("/sign-in")

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return (
        <>
        <AgentsHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentViewLoading />}>
                <AgentsView />
            </Suspense>
        </HydrationBoundary>
        </>
    )

}