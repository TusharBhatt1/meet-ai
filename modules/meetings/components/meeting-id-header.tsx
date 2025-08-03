"use client";
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
import { Edit2Icon, Ellipsis, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmationDialog";
import { useState } from "react";

import { MeetingGetOne } from "../types";
import { UpdateMeetingDialog } from "./update-meeting-dialog";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { statusColorMap, statusIconMap } from "./meetings-data-columns";
import { cn } from "@/lib/utils";

export default function MeetingIdHeader({ data }: { data: MeetingGetOne }) {
  const { meetings, agents } = data;
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const trpc = useTRPC();

  const router = useRouter();

  const { mutate: onDelete, isPending: isDeleting } = useMutation(
    trpc.meetings.delete.mutationOptions({
      onSuccess: (res) => {
        setOpenConfirmationDialog(false);
        toast.success(res.message);
        router.push("/meetings");
      },
      onError: () => {
        toast.error("Something went wrong !");
      },
    })
  );

  const { status } = meetings;
  const StatusIcon = statusIconMap[status];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <ConfirmDialog
          isProcessing={isDeleting}
          openConfirmationDialog={openConfirmationDialog}
          setOpenConfirmationDialog={setOpenConfirmationDialog}
          title="Are you sure you want to delete ?"
          description={`This will delete this meeting`}
          onConfirm={() =>
            onDelete({
              id: meetings.id,
            })
          }
        />
        <UpdateMeetingDialog
          open={openUpdateDialog}
          onOpenChange={setOpenUpdateDialog}
          initialValues={data}
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/meetings">Meetings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="pointer-events-none text-foreground">
              <BreadcrumbLink>{meetings.name}</BreadcrumbLink>
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
      <div className="bg-background p-4 space-y-4 rounded-t-xl">
        <div className="mb-4 space-y-3">
          <p className="font-bold text-xl">{meetings.name}</p>
          <Badge
            variant="outline"
            className={cn(
              "capitalize [&>svg]:size-4 text-muted-foreground",
              statusColorMap[status]
            )}
          >
            <StatusIcon
              className={cn(status === "processing" && "animate-spin")}
            />
            {status}
          </Badge>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <GeneratedAvatar
            seed={agents.name}
            variant="botttsNeutral"
            className="size-5"
          />
          <span className="text-muted-foreground">{agents.name}</span>
        </div>
      </div>
    </div>
  );
}
