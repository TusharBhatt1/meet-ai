"use client";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdHeader from "./meeting-id-header";
import { UpcomingState } from "./states/upcoming-state";
import { ActiveState } from "./states/active-state";
import { CancelledState } from "./states/cancelled-state";
import { ProcessingState } from "./states/processing-state";

export default function MeetingIdView({ meetingId }: { meetingId: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  const {
    meeting: { meetings },
  } = data;
  const status = meetings.status;

  return (
    <>
      <MeetingIdHeader data={data.meeting} />
      {status === "upcoming" && (
        <UpcomingState
          meetingId={meetings.id}
          onCancelMeeting={() => {}}
          isCancelling={false}
        />
      )}
      {status === "active" && <ActiveState meetingId={meetings.id} />}
      {status === "processing" && <ProcessingState />}
      {status === "cancelled" && <CancelledState />}
      {status === "completed" && <p>Completed</p>}
    </>
  );
}

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading meeting"
      description="Please wait while we load the meeting"
    />
  );
};
