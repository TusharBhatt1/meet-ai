"use client"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import logo from "@/public/logo.svg"
import { z } from "zod"


import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import useAuth, { signInformSchema } from "@/hooks/useAuth";
import SocialsView from "./socials-view";



export default function SignIn() {

    const { error, setError, submitting, onSubmit, signInform } = useAuth()


    const handleSubmit = async (data: z.infer<typeof signInformSchema>) => {
        onSubmit(data, "signIn")
    }

    return (
        <Card className="overflow-hidden p-0">
            <CardContent className="grid md:grid-cols-2 p-0">

                <Form {...signInform}>
                    <form onSubmit={signInform.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col justify-center p-7">
                            <h1 className="text-xl font-bold text-foreground">Welcome back !</h1>
                            <p className="pb-7 text-muted-foreground text-balance">Login in to your account.</p>
                            <div className="flex flex-col gap-7">
                                <FormField
                                    control={signInform.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="xyz@gmail.com" {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setError(undefined)
                                                    }} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signInform.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} onChange={(e) => {
                                                    field.onChange(e)
                                                    setError(undefined)
                                                }
                                                } />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}

                                />
                                {error && <Alert className="bg-destructive/10">
                                    <OctagonAlertIcon className="!text-destructive" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>}
                                <Button type="submit" disabled={submitting}>Sign in{submitting && <LoaderCircle className="animate-spin" />}</Button>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 px-2 bg-card text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <SocialsView submitting={submitting}/>
                                <div className="text-center">
                                    Dont have an account ? <Link href={"/sign-up"} className="underline underline-offset-4">Sign up</Link>
                                </div>

                            </div>
                        </div>
                    </form>
                </Form>
                <div className="bg-radial from-gray-700 to-green-900 hidden md:flex flex-col gap-y-4 items-center justify-center">
                    <Image height={40} width={40} alt="Meet AI" className="size-20 rounded-full" src={logo} />
                    <span className="text-white font-bold">Meet.AI</span>
                </div>
            </CardContent>
        </Card>
    )
}