import z from "zod";

const createAgentSchema = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters" }),
  instructions: z.string().min(5, { message: "Minimum 5 characters" }),
});

const updateAgentSchema = createAgentSchema.extend({
  id: z.string(),
});

export { createAgentSchema, updateAgentSchema };
