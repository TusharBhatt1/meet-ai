"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { createMeetingSchema } from "../schema";
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
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { MeetingGetOne } from "../types";

import { ComboBox } from "@/components/ui/combobox";
import GeneratedAvatar from "@/modules/dashboard/generated-avatar";
import { useState } from "react";

interface MeetingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export default function MeetingForm({
  initialValues,
  onSuccess,
  onCancel,
}: MeetingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [search, setSearchTerm] = useState("");

  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 20,
    })
  );

  const isEdit = !!initialValues;

  const form = useForm<z.infer<typeof createMeetingSchema>>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      name: initialValues?.name || "",
      agentId: initialValues?.agentId || "",
    },
  });

  const { mutateAsync: createMeeting, isPending } = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        toast.success(res.message);
      },
      onError: (e) => toast.error(e.message),
    })
  );

  const { mutateAsync: updateMeeting, isPending: isUpdating } = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: () => toast.success("Meeting updated successfully."),
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = async (data: z.infer<typeof createMeetingSchema>) => {
    if (isEdit) {
      await updateMeeting({ id: initialValues.id, ...data });
      queryClient.invalidateQueries(
        trpc.meetings.getOne.queryOptions({ id: initialValues.id })
      );
    } else {
      console.log(data);
      await createMeeting({ ...data });
    }
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Weekend concert"
                  autoComplete={"off"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <ComboBox
                  //@ts-expect-error TODO
                  options={agents?.items.map((a) => ({
                    label: a.name,
                    value: a.id,
                    children: (
                      <div className="flex items-center gap-2">
                        <GeneratedAvatar
                          seed={a.name}
                          variant="botttsNeutral"
                          className="size-4"
                        />
                        <span>{a.name}</span>
                      </div>
                    ),
                  }))}
                  value={field.value}
                  onValueChange={(value) => console.log(value)}
                  onSelect={field.onChange}
                  onSearch={setSearchTerm}
                  placeholder="Select an agent."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 mt-12">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || isPending || isUpdating}
          >
            {isEdit ? "Update" : "Create"}
            {(isPending || isUpdating) && (
              <LoaderCircleIcon className="animate-spin" />
            )}
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
