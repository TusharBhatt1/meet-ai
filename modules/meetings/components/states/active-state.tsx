import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;

}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-b-lg py-8 flex flex-col gap-y-4 items-center justify-center">
      <EmptyState
        image="/upcoming-state.svg"
        title="Meeting is active"
        description="Meeting will end once every participant has left."
      />
      <div className="flex gap-2">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="mr-2 size-4" />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
