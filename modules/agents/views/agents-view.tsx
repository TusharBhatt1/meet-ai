"use client";

import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";
export default function Page() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  if (!data.length) {
    return (
      <EmptyState
        title="Create your first agent"
        description="Give instructions and the agent and work accordingly."
      />
    );
  }

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading agents"
      description="Please wait while we load the agents"
    />
  );
};
