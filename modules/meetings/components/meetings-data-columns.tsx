"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../types";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  Loader,
  LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { meetingStatus } from "@/app/db/schema";
import { cn, formatDuration } from "@/lib/utils";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";


type status = (typeof meetingStatus.enumValues)[number];

export const statusIconMap: Record<status, React.ElementType> = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: Loader,
  cancelled: CircleXIcon,
};

export const statusColorMap: Record<status, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-gray-500/20 text-rose-800 border-rose-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <span className="font-semibold capitalize">{row.original.name}</span>
        <div className="flex items-center gap-2 my-2">
          <GeneratedAvatar
            seed={row.original.agent.name}
            variant="botttsNeutral"
            className="size-4"
          />
          <span className="text-muted-foreground text-xs">
            {row.original.agent.name}
          </span>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "summary",
    header: "Summary",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const Icon = statusIconMap[status];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[status]
          )}
        >
          <Icon className={cn(status === "processing" && "animate-spin")} />
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-500" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration yet"}
      </Badge>
    ),
  },
];
