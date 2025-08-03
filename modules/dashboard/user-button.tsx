import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import GeneratedAvatar from "./generated-avatar";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function UserButton() {
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger className="w-full mb-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 truncate">
            {data.user.image ? (
              <Avatar className="size-12">
                <AvatarImage src={data.user.image} alt={data.user.name} />
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={data.user.name}
                variant="initials"
                className="size-9"
              />
            )}
            <div className="text-left truncate">
              <p className="truncate">{data.user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {data.user.email}
              </p>
            </div>
          </div>
          {open ? (
            <ChevronUp className="size-4 shrink-0" />
          ) : (
            <ChevronDown className="size-4 shrink-0" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>{data.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => redirect("/sign-in"),
              },
            })
          }
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
