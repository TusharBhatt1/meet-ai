import { useCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
import CallLobby from "./call-lobby";
import CallActive from "./call-active";
import CallEnded from "./call-ended";

export default function CallUI({ meetingName }: { meetingName: string }) {
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const call = useCall();

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow("call");
  };
  const handleLeave = async () => {
    if (!call) return;
    await call.endCall();
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
}
