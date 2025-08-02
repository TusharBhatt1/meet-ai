"use client";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "../components/new-agent-dialog";
import useAgentsFilter from "../../hooks/useAgentsFilters";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE_NUMBER } from "@/constants";

export default function AgentsHeader() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useAgentsFilter();

  return (
    <div>
      <div className="flex justify-between">
        <NewAgentDialog open={open} onOpenChange={() => setOpen(false)} />
        <h5 className="font-bold">My Agents</h5>
        <Button onClick={() => setOpen(true)}>
          {" "}
          <Plus /> New agent
        </Button>
      </div>
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
    </div>
  );
}
