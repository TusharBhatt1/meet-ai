import JSONL from "jsonl-parse-stringify";
import { inngest } from "./client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "../db";
import { agents, meetings, user } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarizer = createAgent({
  name: "Summarizer",
  system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
    `.trim(),
  model: openai({ model: "gpt-4o", apiKey: "xyz" }),
});

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    // const response = await step.run("fetch-transcipt", async () => {
    //   return fetch(event.data.transciptUrl).then((res) => res.text);
    // });
    const response = await step.fetch(
      "fetch-transcript",
      event.data.transciptUrl
    );
    const transcript = await step.run("parse-transcipt", async () => {
      const text = await response.text();
      return JSONL.parse<StreamTranscriptItem>(text);
    });

    const transciptWithSpeakers = await step.run("add-speakers", async () => {
      const speakersId = [...new Set(transcript.map((t) => t.speaker_id))];
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakersId))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentsSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakersId))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentsSpeakers];

      return transcript.map((item) => {
        const matchingSpeaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!matchingSpeaker) {
          return {
            ...item,
            user: {
              role: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: matchingSpeaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcipt :" +
        JSON.stringify(transciptWithSpeakers)
    );

    await step.run("save-summary-to-db", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  }
);
