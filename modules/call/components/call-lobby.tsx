import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  useCallStateHooks,
  StreamVideoParticipant,
  VideoPreview,
  DefaultVideoPlaceholder,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
} from "@stream-io/video-react-sdk";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

const DisableVideoPreview = () => {
  const { data } = useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.image,
          image: createAvatar(initials, {
            seed: data?.user.name ?? "",
            fontSize: 42,
            fontWeight: 700,
          }).toDataUri(),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermission = () => {
  return (
    <p className="text-sm">
      Please grant your browser permission for camera and microphone
    </p>
  );
};
export default function CallLobby({ onJoin }: { onJoin: () => void }) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasCamPermission } = useCameraState();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();

  const hasMicAndCamPerm = hasCamPermission && hasMicPermission;

  return (
    <div className="h-full flex justify-center items-center">
      <div className="p-7 gap-3 flex flex-col rounded-md shadow-md justify-center items-center bg-background">
        <div className="space-y-2 text-center">
          <h4 className="font-bold text-lg">Ready to Join ?</h4>
          <p className="text-sm">Setup your call before joining</p>
        </div>
        <VideoPreview
          DisabledVideoPreview={
            hasMicAndCamPerm ? DisableVideoPreview : AllowBrowserPermission
          }
        />
        <div className="flex gap-3">
          <ToggleVideoPreviewButton />
          <ToggleAudioPreviewButton />
        </div>
        <div className="flex justify-between w-full">
          <Button variant={"ghost"}>
            <Link href={"/meetings"}>Cancel</Link>
          </Button>
          <Button onClick={onJoin}>
            <LogInIcon />
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
