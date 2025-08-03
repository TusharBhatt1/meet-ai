"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { NewMeetingDialog } from "./new-meetings-dialog";
import MeetingFilters from "./meetings-filter";

export default function MeetingsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <NewMeetingDialog open={open} onOpenChange={() => setOpen(false)} />
        <h5 className="font-bold">My Meetings</h5>
        <Button onClick={() => setOpen(true)}>
          {" "}
          <Plus /> New Meeting
        </Button>
      </div>
      <MeetingFilters />
    </div>
  );
}
