"use client";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import useAgentsFilter from "../../hooks/useAgentsFilters";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { NewMeetingDialog } from "./new-meetings-dialog";

export default function MeetingsHeader() {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useAgentsFilter();

  const { data } = useQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
      <div className="flex justify-between">
        <NewMeetingDialog open={open} onOpenChange={() => setOpen(false)} />
        <h5 className="font-bold">My Meetings</h5>
        <Button onClick={() => setOpen(true)}>
          {" "}
          <Plus /> New Meeting
        </Button>
      </div>
      {data?.total ? (
        <div className="flex gap-3">
          <div className="relative w-42">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Filter by name"
              className="pl-10 bg-background"
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
            />
          </div>
          {filters.search && (
            <Button
              onClick={() => {
                setFilters({
                  page: DEFAULT_PAGE_NUMBER,
                  search: "",
                });
              }}
              variant={"outline"}
            >
              <X /> Clear
            </Button>
          )}
        </div>
      ) : null} 
    </div>
  );
}
