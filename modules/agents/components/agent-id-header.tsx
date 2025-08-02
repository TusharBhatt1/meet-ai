"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { Edit2Icon, Ellipsis, Trash, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmationDialog";
import { useState } from "react";
import { UpdateAgentDialog } from "./update-agent-dialog";
import { AgentGetOne } from "../types";

export default function AgentIdHeader({ data }: { data: AgentGetOne }) {
  const { id: agentId, instructions, name, meetingCount } = data;
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const trpc = useTRPC();

  const router = useRouter();

  const { mutate: onDelete, isPending: isDeleting } = useMutation(
    trpc.agents.delete.mutationOptions({
      onSuccess: (res) => {
        setOpenConfirmationDialog(false);
        toast.success(res.message);
        router.push("/agents");
      },
      onError: () => {
        toast.error("Something went wrong !");
      },
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <ConfirmDialog
          isProcessing={isDeleting}
          openConfirmationDialog={openConfirmationDialog}
          setOpenConfirmationDialog={setOpenConfirmationDialog}
          title="Are you sure you want to delete ?"
          description={`This will delete associated ${meetingCount} meetings as well.`}
          onConfirm={() =>
            onDelete({
              agentId,
            })
          }
        />
        <UpdateAgentDialog
          open={openUpdateDialog}
          onOpenChange={setOpenUpdateDialog}
          initialValues={data}
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/agents">Agents</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="pointer-events-none text-foreground">
              <BreadcrumbLink>{name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="shadow-md rounded-md bg-background p-2 space-y-3">
            <DropdownMenuItem className="">
              <Button
                onClick={() => setOpenUpdateDialog(true)}
                variant={"outline"}
                className="w-full border-none"
                disabled={isDeleting}
              >
                <Edit2Icon size={12} /> Edit
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                disabled={isDeleting}
                variant={"destructive"}
                className="border-none"
                onClick={() => setOpenConfirmationDialog(true)}
              >
                <Trash />
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="bg-background p-4 space-y-5 rounded-xl">
        <p className="font-bold text-xl mb-4">{name}</p>

        <Badge variant="outline">
          <VideoIcon className="text-blue-500" />{" "}
          {meetingCount + ` ${meetingCount === 1 ? "meeting" : "meetings"}`}
        </Badge>
        <div className="space-y-1">
          <h2 className="font-semibold">Instructions</h2>
          <p className="text-muted-foreground text-sm">{instructions}</p>
        </div>
      </div>
    </div>
  );
}
