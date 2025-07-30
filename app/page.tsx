"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn, signOut, signUp, useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";

export default function Home() {

  const { data: session, isPending } = useSession();
  console.log(session);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    image: "",
  })

  const handleSignUp = async () => {
    await signUp.email({
      email: userData.email,
      password: userData.password,
      name: userData.name,

    }, {
      onRequest: () => {
        console.log("in progress...");
      },
      onSuccess: () => {
        alert("Success...");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  }

  const handleSignIn = async () => {
    await signIn.email({
      email: userData.email,
      password: userData.password,

    }, {
      onRequest: () => {
        console.log("in progress...");
      },
      onSuccess: () => {
        alert("Success...");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  if (isPending) return <span>Loading...</span>

  if (session) {
    return (
      <div>
        <h1>Welcome {session.user?.name}</h1>
        <Button onClick={() => signOut()}>Signout</Button>
      </div>
    )
  }
  return (
    <div className="p-4">
      <div className="space-y-4 max-w-md m-auto">
        <Input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
        <Input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} />
        <Input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleChange} />
        <Button onClick={handleSignUp}>Click me to sign Up</Button>
      </div>

      <div className="space-y-4 max-w-md m-auto mt-12">
        <Input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
        <Input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} />
        <Button onClick={handleSignIn}>Click me to sign In</Button>
      </div>
    </div>
  );
}
