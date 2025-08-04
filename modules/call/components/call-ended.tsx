import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallEnded() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-background p-4 rounded-md flex flex-col justify-center items-center gap-3">
        <p className="text-primary font-bold">You have ended the cal</p>
        <p className="text-sm">Summary will appear in a while.</p>
        <Button variant={"outline"} className="mt-7">
          <Link href={"/meetings"}>Back</Link>
        </Button>
      </div>
    </div>
  );
}
