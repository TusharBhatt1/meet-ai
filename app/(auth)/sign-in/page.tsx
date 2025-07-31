import { auth } from "@/lib/auth";
import SignIn from "@/modules/auth/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) redirect("/")
        
    return (
        <SignIn />
    )
}