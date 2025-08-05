import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardTrial() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!data) return null;

  const agentUsed = data.user_agents_count;
  const agentProgress = Math.min((agentUsed / MAX_FREE_AGENTS) * 100, 100);

  const meetingUsed = data.user_meetings_count ?? 0; // assuming this exists
  const meetingProgress = Math.min(
    (meetingUsed / MAX_FREE_MEETINGS) * 100,
    100
  );

  return (
    <div className="w-full max-w-sm space-y-4 bg-neutral-400/10 rounded-md p-2 backdrop-blur-md">
      <p className="text-sm font-medium text-left">Free trials left</p>

      <div className="text-xs text-muted-foreground">
        {agentUsed}/{MAX_FREE_AGENTS} agents
      </div>
      <Progress value={agentProgress} className="w-full" />

      <div className="text-xs text-muted-foreground">
        {meetingUsed}/{MAX_FREE_MEETINGS} meetings
      </div>
      <Progress value={meetingProgress} className="w-full" />
      <Button variant={"outline"} className="w-full">
        <Link href={"/upgrade"} className="flex items-center gap-1">
          {" "}
          <RocketIcon className="size-4" /> Upgrade
        </Link>
      </Button>
    </div>
  );
}
