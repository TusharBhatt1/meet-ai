import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css"

interface ChatUIProps {
  meetingId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export default function ChatUI({
  meetingId,
  userId,
  userName,
  userImage,
}: ChatUIProps) {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.getChatToken.mutationOptions()
  );

  const [channel, setChannel] = useState<StreamChannel>();

  const chatClient = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", meetingId, {
      members: [userId],
    });

    setChannel(channel);
  }, [chatClient, meetingId, userId]);

  if (!chatClient) {
    return <LoadingState title="Loading Chat" />;
  }

  return (
    <div className="bg-background">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <Window>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
              <MessageList />
            </div>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
