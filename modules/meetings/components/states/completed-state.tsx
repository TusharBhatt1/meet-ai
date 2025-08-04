import { ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  BookOpenTextIcon,
  FileTextIcon,
  FileVideoIcon,
  SparkleIcon,
  SparklesIcon,
} from "lucide-react";
import { MeetingGetOne } from "@/modules/meetings/types";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { format } from "date-fns";
import Link from "next/link";
import Markdown from "react-markdown";

export default function CompletedState({ data }: { data: MeetingGetOne }) {
  const { meetings: meeting } = data;

  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background 
                        data-[state=active]:shadow-none border-b-2 border-transparent 
                        data-[state=active]:border-b-primary 
                        data-[state=active]:text-accent-foreground 
                        h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background 
                        data-[state=active]:shadow-none border-b-2 border-transparent 
                        data-[state=active]:border-b-primary 
                        data-[state=active]:text-accent-foreground 
                        h-full hover:text-accent-foreground"
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background 
                        data-[state=active]:shadow-none border-b-2 border-transparent 
                        data-[state=active]:border-b-primary 
                        data-[state=active]:text-accent-foreground 
                        h-full hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background 
                        data-[state=active]:shadow-none border-b-2 border-transparent 
                        data-[state=active]:border-b-primary 
                        data-[state=active]:text-accent-foreground 
                        h-full hover:text-accent-foreground"
              >
                <SparkleIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="recording">
            <div className="bg-white rounded-lg border px-4 py-5">
              <video
                src={meeting.recordingUrl!}
                className="w-full rounded-lg"
                controls
              />
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="bg-white">
              <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                <h2 className="text-2xl font-medium capitalize">
                  {meeting.name}
                </h2>
                <div className="flex gap-x-2 items-center">
                  <Link
                    href={`/agents/${meeting.agentId}`}
                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                  >
                    <GeneratedAvatar
                      variant="botttsNeutral"
                      seed={data.agents.name}
                      className="size-5"
                    />
                    {data.agents.name}
                  </Link>

                  <p className="text-sm">
                    {meeting.startedAt
                      ? format(meeting.startedAt, "PPP")
                      : "No start time available"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4" />
                  <p>General summary</p>
                </div>
                {/* 
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                  <ClockFadingIcon className="text-blue-700" />
                  
                  {data.meetings?.duration
                    ? formatDuration(data.duration)
                    : "No duration"}
                </Badge> */}

                <div>
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-6 mb-2">
                          {children}
                        </h2>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 text-gray-700">{children}</p>
                      ),
                      li: ({ children }) => (
                        <li className="list-disc ml-6">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {meeting.summary}
                  </Markdown>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
