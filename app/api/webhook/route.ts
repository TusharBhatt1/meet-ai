import { db } from "@/app/db";
import OpenAI from "openai";
import { agents, meetings } from "@/app/db/schema";
import { inngest } from "@/app/ingest/client";
import { streamClient } from "@/lib/stream-client";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  MessageNewEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/chat";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

const verifySignatureWithSDK = (body: string, signature: string) => {
  return streamClient.verifyWebhook(body, signature);
};
const openAi = new OpenAI();

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x.api-key");

  if (!signature || apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 400 });
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Meeting ID found" }, { status: 400 });
    }

    const [associatedMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "upcoming")));

    if (!associatedMeeting)
      return NextResponse.json({
        error: "Meeting not found",
        status: 404,
      });

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, associatedMeeting.id));

    const [associatedAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, associatedMeeting.agentId));

    if (!associatedAgent)
      return NextResponse.json({
        error: "Agent not found",
        status: 404,
      });

    const call = streamClient.video.call("default", meetingId);
    const realTimeClient = await streamClient.video.connectOpenAi({
      call,
      agentUserId: associatedAgent.id,
      openAiApiKey:
        "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",
    });

    realTimeClient.updateSession({
      instructions: associatedAgent.instructions,
    });
    if (!realTimeClient) console.log("API KEY WRONG");
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }

    const call = streamClient.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Meeting ID found" }, { status: 400 });
    }

    const [associatedMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));

    if (!associatedMeeting)
      return NextResponse.json({
        error: "Meeting not found",
        status: 404,
      });

    await db
      .update(meetings)
      .set({
        status: "processing",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, associatedMeeting.id));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid?.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Meeting ID found" }, { status: 400 });
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transciptUrl: event.call_transcription.url,
        // status:"completed"
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: meetingId,
        transcriptUrl: updatedMeeting.transciptUrl,
      },
    });

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid?.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Meeting ID found" }, { status: 400 });
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    const [associatedMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

    if (!associatedMeeting)
      return NextResponse.json({
        error: "Meeting not found",
        status: 404,
      });

    const [associatedAgent] = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, associatedMeeting.agentId)));

    if (!associatedAgent)
      return NextResponse.json({
        error: "Agent not found",
        status: 404,
      });

    if (userId !== associatedAgent.id) {
      const instructions = `
        You are an AI assistant helping the user revisit a recently completed meeting.
        Below is a summary of the meeting, generated from the transcript:
        
        ${associatedMeeting.summary}
        
        The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
        
        ${associatedAgent.instructions}
        
        The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
        Always base your responses on the meeting summary above.
        
        You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
        
        If the summary does not contain enough information to answer a question, politely let the user know.
        
        Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
        `;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === associatedAgent.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const GPTresponse = await openAi.chat.completions.create({
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
        model: "gpt-3.5-turbo",
      });
      const GPTresponseText = GPTresponse.choices[0].message.content;

      if (!GPTresponseText) {
        return NextResponse.json(
          { error: "No GPT response text found" },
          { status: 400 }
        );
      }

      const avatarUrl = createAvatar(initials, {
        seed: associatedAgent.name,
        fontWeight: 700,
        fontSize: 42,
      }).toDataUri();

      streamChat.upsertUser({
        id: associatedAgent.id,
        name: associatedAgent.name,
        image: avatarUrl,
      });

      channel.sendMessage({
        text: GPTresponseText,
        user: {
          id: associatedAgent.id,
          name: associatedAgent.name,
          image: avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
