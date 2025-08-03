import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
  return (
    <div className="bg-white rounded-b-lg py-8 flex flex-col gap-y-4 items-center justify-center">
      <EmptyState
        image="/cancelled-state.svg"
        title="Meeting cancelled"
        description="This meeting was cancelled"
      />
    </div>
  );
};
