"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

export default function CallView({ meetingId }: { meetingId: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  if (data.meeting.meetings.status === "completed")
    return (
      <div className="h-screen flex justify-center items-center">
        <ErrorState
          title="Meeting has ended"
          description="You no longer can join it."
        />
      </div>
    );
  return (
    <CallProvider
      meetingId={data.meeting.meetings.id}
      meetingName={data.meeting.meetings.name}
    />
  );
}
export const CallViewLoading = () => {
  return <LoadingState title="Setting up you call" />;
};
