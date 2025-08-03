"use client";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdHeader from "./meeting-id-header";

export default function MeetingIdView({ meetingId }: { meetingId: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  return (
    <>
      <MeetingIdHeader data={data.meeting} />
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
