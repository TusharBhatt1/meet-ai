"use client";

import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/agents-data-columns";
import { DataTable } from "../../../components/data-table";
import { EmptyState } from "@/components/empty-state";
import useAgentsFilter from "../../hooks/useAgentsFilters";
import { DataTablePagination } from "@/components/data-table-pagination";
import { redirect } from "next/navigation";

export default function Page() {
  const trpc = useTRPC();
  const { filters, setFilters } = useAgentsFilter();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions(filters));

  if (!data.items.length) {
    return (
      <EmptyState
        title="Create your first agent"
        description="Give instructions and the agent will work accordingly."
      />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(agentId) => redirect(`/agents/${agentId}`)}
      />
      <DataTablePagination
        currentPage={filters.page}
        onPageChange={(pageNum) =>
          setFilters({
            ...filters,
            page: pageNum,
          })
        }
        totalPages={data.totalPages}
      />
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
