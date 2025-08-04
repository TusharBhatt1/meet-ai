import { useSession } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import CallConnect from "./call-connect";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data, isPending } = useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-5 animate-spin text-white" />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        createAvatar(initials, {
          seed: data.user.name,
          fontWeight: 700,
          fontSize: 42,
        }).toDataUri()
      }
    />
  );
};
