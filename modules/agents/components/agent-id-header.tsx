import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  name: string;
  instructions: string;
  meetingCount: number;
}
export default function AgentIdHeader({
  name,
  instructions,
  meetingCount,
}: Props) {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/agents">
              <BreadcrumbLink>Agents</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="pointer-events-none text-foreground">
            <BreadcrumbLink>{name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-background p-4 space-y-5 rounded-xl">
        <p className="font-bold text-xl mb-4">{name}</p>

        <Badge variant="outline">
          <VideoIcon className="text-blue-500" />{" "}
          {meetingCount + ` ${meetingCount === 1 ? "meeting" : "meetings"}`}
        </Badge>
        <div className="space-y-1">
          <h2 className="font-semibold">Instructions</h2>
          <p className="text-muted-foreground text-sm">{instructions}</p>
        </div>
      </div>
    </div>
  );
}
