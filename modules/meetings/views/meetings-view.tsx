"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/meetings-data-columns"
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { DataTablePagination } from "@/components/data-table-pagination";
import { redirect } from "next/navigation";
import useMeetingsFilter from "../hooks/useMeetingsFilters";

export default function Page() {
  const trpc = useTRPC();
  const { filters, setFilters } = useMeetingsFilter();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions(filters));

  if (!data.items.length) {
    return (
      <EmptyState
        title="Create your first meeting"
        description="Schedule a meeting to connect with others in real time."
      />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(meetingId) => redirect(`/meetings/${meetingId}`)}
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
