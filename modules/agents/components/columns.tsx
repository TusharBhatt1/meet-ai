"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetOne } from "../types";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <GeneratedAvatar
            seed={row.original.name}
            className="size-8"
            variant="botttsNeutral"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "instructions",
    header: "Instructions",
  },
  // {
  //     accessorKey: "meetingCount",
  //     header: "Meeting Count",
  //     cell:({row})=>{
  //         <p>{row.or}</p>
  //     }
  // }
];
