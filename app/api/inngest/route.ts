import { serve } from "inngest/next";
import { inngest } from "@/app/ingest/client";
import { meetingsProcessing } from "@/app/ingest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [meetingsProcessing],
});
