"use client";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import AgentIdHeader from "../components/agent-id-header";

export default function AgentIdView({ agentId }: { agentId: string }) {
  console.log(agentId);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  return (
    <>
      <AgentIdHeader
        name={data.name}
        instructions={data.instructions}
        meetingCount={data.meetingCount}
      />
    </>
  );
}

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading agent"
      description="Please wait while we load the agent"
    />
  );
};
