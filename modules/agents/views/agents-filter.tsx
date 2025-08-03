import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { SearchIcon, X } from "lucide-react";
import useAgentsFilter from "../hooks/useAgentsFilters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AgentsFilters() {
  const { filters, setFilters } = useAgentsFilter();

  return (
    <ScrollArea>
      <div className="flex gap-3 items-center">
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
