"use client"

import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Page() {
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

    return (
        <div>
            {data.map((agent) => <p key={agent.id}>{agent.name}</p>)}
        </div>
    )
}

export const AgentViewLoading = () => {
    return <LoadingState title="Loading agents" description="Please wait while we load the agents" />
}