import { LoadingState } from "@/components/loading-state";
import { useSession } from "@/lib/auth-client";
import ChatUI from "./chat-ui";

export const ChatProvider = ({
  meetingId,
}: {
  meetingId: string;
  meetingName: string;
}) => {
  const { data, isPending } = useSession();

  if (isPending || !data?.user) {
    return (
      <LoadingState
        title="Loading..."
        description="Please wait while we load the chat"
      />
    );
  }
  return (
    <ChatUI
      meetingId={meetingId}
      userId={data.user.id}
      userName={data.user.name}
      userImage={data.user.image || ""}
    />
  );
};
