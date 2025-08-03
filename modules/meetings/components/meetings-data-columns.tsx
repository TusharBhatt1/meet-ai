"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetOne } from "../types";
import { Ban, CheckCircle, Clock, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JSX } from "react";

export const columns: ColumnDef<MeetingGetOne>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold capitalize">{row.original.name}</span>
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
      const status = row.getValue("status") as string;

      const statusMap: Record<
        string,
        { label: string; icon: JSX.Element; className: string }
      > = {
        upcoming: {
          label: "Upcoming",
          icon: <Clock className="w-3 h-3" />,
          className: "border-blue-100 text-blue-700",
        },
        active: {
          label: "Active",
          icon: <CheckCircle className="w-3 h-3" />,
          className: "border-green-100 text-green-700",
        },
        procession: {
          label: "Procession",
          icon: <Loader className="w-3 h-3 animate-spin" />,
          className: "border-sky-100 text-sky-700",
        },
        cancelled: {
          label: "Cancelled",
          icon: <Ban className="w-3 h-3" />,
          className: "border-red-100 text-red-700",
        },
      };

      const { label, icon, className } = statusMap[status] ?? {
        label: "Unknown",
        icon: <Ban className="w-3 h-3" />,
        className: "border-muted text-muted-foreground",
      };

      return (
        <Badge
          variant={"outline"}
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${className}`}
        >
          {icon}
          {label}
        </Badge>
      );
    },
  },
];
