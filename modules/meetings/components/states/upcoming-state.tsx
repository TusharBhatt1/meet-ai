import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
  isCancelling: boolean;
}

export const UpcomingState = ({
  meetingId,
  isCancelling,
}: Props) => {
  return (
    <div className="bg-background rounded-b-lg py-8 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming-state.svg"
        title="Not started yet !"
        description="This meeting hasn’t started yet. Once it begins, you’ll see the details here."
      />
      <div className="flex gap-4 lg:flex-row flex-col">
        <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="mr-2 size-4" />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
