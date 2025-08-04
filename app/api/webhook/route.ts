import { db } from "@/app/db";
import { agents, meetings } from "@/app/db/schema";
import { streamClient } from "@/lib/stream-client";
import {
    CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const verifySignatureWithSDK = (body: string, signature: string) => {
  return streamClient.verifyWebhook(body, signature);
};

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
      })
      .where(eq(meetings.id, meetingId)).returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }
  }
  else if (eventType === "call.recording_ready") {
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
      .where(eq(meetings.id, meetingId)).returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }
  }
  return NextResponse.json({ status: "ok" });
}
