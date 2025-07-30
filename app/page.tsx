"use client"
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export default function Home() {

  const { data: session, isPending } = useSession();
  console.log(session);
 

  if (isPending) return <span>Loading...</span>

  if (session) {
    return (
      <div>
        <h1>Welcome {session.user?.name}</h1>
        <Button onClick={() => signOut()}>Signout</Button>
      </div>
    )
  }
 
}
