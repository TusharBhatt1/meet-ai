"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { createAgentSchema } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AgentGetOne } from "../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export default function AgentForm({
  initialValues,
  onSuccess,
  onCancel,
}: AgentFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isEdit = !!initialValues;

  const form = useForm<z.infer<typeof createAgentSchema>>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: initialValues?.name || "",
      instructions: initialValues?.instructions || "",
    },
  });

  const { mutateAsync: createAgent, isPending } = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        // TODO: invalidate free tier usage

        toast.success(res.message);
      },
      onError: (e) => toast.error(e.message),
    })
  );

  const { mutateAsync: updateAgent, isPending: isUpdating } = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: () => toast.success("Agent updated successfully."),
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = async (data: z.infer<typeof createAgentSchema>) => {
    if (isEdit) {
      await updateAgent({ id: initialValues.id, ...data });
      queryClient.invalidateQueries(
        trpc.agents.getOne.queryOptions({ id: initialValues.id })
      );
    } else {
      await createAgent({ ...data });
    }
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="size-16"
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Math tutor"
                  autoComplete={"off"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a math tutor that can answer questions and do tasks"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 mt-12">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || isPending || isUpdating}
          >
            {isEdit ? "Update" : "Create"}
            {isPending ||
              (isUpdating && <LoaderCircleIcon className="animate-spin" />)}
          </Button>
          {onCancel && (
            <Button
              variant={"outline"}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
