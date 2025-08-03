import z from "zod";

const createMeetingSchema = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters" }),
  agentId: z.string().min(1, { message: "Minimum 1 character" }),
});

const updateMeetingSchema = createMeetingSchema.extend({
  id: z.string(),
});

export { createMeetingSchema, updateMeetingSchema };
