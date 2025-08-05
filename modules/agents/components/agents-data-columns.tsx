"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../types";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
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
  {
    accessorKey: "meetingCount",
    header: "Meeting Count",
    cell: ({ row }) => (
      <Badge variant={"outline"}>
        <VideoIcon className="text-blue-500 " />
        {row.original.meetingCount +
          `${row.original.meetingCount === 1 || row.original.meetingCount === 0 ? " meeting" : " meetings"}`}
      </Badge>
    ),
  },
];
