import React, { useEffect, useState } from "react";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import GeneratedAvatar from "./generated-avatar";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DashboardCommands({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const [search, setSearch] = useState("");
  const trpc = useTRPC();

  const { data: meetings, isLoading: isMeetingLoading } = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: 20,
    })
  );
  const { data: agents, isLoading: isAgentLoading } = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 20,
    })
  );

  const router = useRouter();

  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Find a meeting or an agent..."
        onValueChange={(value) => setSearch(value)}
      />

      <CommandList>
        <CommandEmpty>
          {isMeetingLoading || isAgentLoading ? (
            <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            <span>No results found</span>
          )}
        </CommandEmpty>
        <CommandGroup heading="Meetings">
          {meetings?.items?.map((m) => (
            <CommandItem
              key={m.id}
              onSelect={() => router.push(`/meeting/${m.id}`)}
              className="flex items-center gap-2"
            >
              <GeneratedAvatar
                seed={m.id}
                variant="botttsNeutral"
                className="w-5 h-5 rounded-full"
              />
              <span>{m.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          {agents?.items?.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => router.push(`/agent/${agent.id}`)}
              className="flex items-center gap-2"
            >
              <GeneratedAvatar
                seed={agent.id}
                variant="botttsNeutral"
                className="w-5 h-5 rounded-full"
              />
              <span>{agent.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
}
