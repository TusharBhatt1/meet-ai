"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function HomeView() {
  const { data: session, isPending } = useSession();

  if (isPending) return <span>Loading...</span>;

  if (session) {
    return (
      <div>
        <h1>Welcome {session.user?.name}</h1>
        <Button
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  redirect("/sign-in");
                },
              },
            })
          }
        >
          Signout
        </Button>
      </div>
    );
  }
}
