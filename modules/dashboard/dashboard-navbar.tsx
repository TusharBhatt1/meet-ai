"use client"
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { DashboardCommands } from "./dashboard-commands";

export default function DashboardNavbar() {
    return (<nav className="pl-4 bg-background">
        <DashboardCommands />
        <Button
            className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={() => { }}
        >
            <SearchIcon />
            Search
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">&#8984;</span>K
            </kbd>
        </Button>

    </nav>)
}