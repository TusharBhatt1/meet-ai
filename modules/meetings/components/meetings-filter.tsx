"use client";

import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMeetingsFilter from "../hooks/useMeetingsFilters";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { MeetingStatus } from "../types";
import { statusColorMap, statusIconMap } from "./meetings-data-columns";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ComboBox } from "@/components/ui/combobox";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function MeetingFilters() {
  const { filters, setFilters } = useMeetingsFilter();

  const [searchTerm, setSearchTerm] = useState("");
  const trpc = useTRPC();
  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 20,
    })
  );

  const filteredAgents = useMemo(() => {
    if (!agents?.items) return [];

    return agents.items.filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, agents?.items]);

  return (
    <ScrollArea>
    <div className="flex gap-3 text-muted-foreground">
      <div className="relative w-42">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2  size-4" />
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
          onClick={() =>
            setFilters({
              ...filters,
              page: DEFAULT_PAGE_NUMBER,
              search: "",
            })
          }
          variant="outline"
        >
          <X className="size-4 mr-1" /> Clear
        </Button>
      )}
      <Select
        value={filters.status ?? ""}
        onValueChange={(value: MeetingStatus) =>
          setFilters({
            ...filters,
            status: value,
          })
        }
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select a status</SelectLabel>
            {Object.entries(MeetingStatus).map(([key, value]) => {
              const Icon = statusIconMap[value];
              const iconColor = statusColorMap[value];

              return (
                <SelectItem key={key} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("rounded-md", iconColor)} />
                    {key}
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {filters.status && (
        <Button
          onClick={() =>
            setFilters({
              ...filters,
              page: DEFAULT_PAGE_NUMBER,
              status: null,
            })
          }
          variant="outline"
        >
          <X className="size-4 mr-1" /> Clear
        </Button>
      )}
      {/* agent */}
      <ComboBox
        options={filteredAgents.map((a) => ({
          label: a.name,
          value: a.id,
          children: (
            <div className="flex items-center gap-2">
              <GeneratedAvatar
                seed={a.name}
                variant="botttsNeutral"
                className="size-4"
              />
              <span>{a.name}</span>
            </div>
          ),
        }))}
        value={filters.agentId || ""}
        onValueChange={(value) =>
          setFilters({
            ...filters,
            agentId: value || null,
          })
        }
        onSearch={setSearchTerm}
        placeholder="Select an agent"
        showAvatar
      />
      {filters.agentId && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFilters({
              ...filters,
              agentId: null,
              page: 1,
            })
          }
          className="px-2"
        >
          <X className="size-4" />
          <p>Clear</p>
        </Button>
      )}
    </div>
    <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}

