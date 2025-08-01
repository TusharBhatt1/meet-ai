"use client";
import { ErrorState } from "@/components/error-state";

export default function Error() {
  return (
    <ErrorState
      title="Error loading agents"
      description="Please try again later"
    />
  );
}
