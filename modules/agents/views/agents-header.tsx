"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "../components/new-agent-dialog";

export default function AgentsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <NewAgentDialog open={open} onOpenChange={() => setOpen(false)} />
      <h5 className="font-bold">My Agents</h5>
      <Button onClick={() => setOpen(true)}>
        {" "}
        <Plus /> New agent
      </Button>
    </div>
  );
}
