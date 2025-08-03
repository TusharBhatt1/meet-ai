import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-b-lg py-8 flex flex-col gap-y-4 items-center justify-center">
      <EmptyState
        image="/processing-state.svg"
        title="Meeting was completed"
        description="This meeting is completed and under process, a summary will appear soon."
      />
    </div>
  );
};
