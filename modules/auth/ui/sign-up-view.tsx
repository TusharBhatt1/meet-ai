"use client"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import logo from "@/public/logo.svg"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path:["confirmPassword"]
})


export default function SignUp() {

    const [error, setError] = useState<string>()
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setSubmitting(true)
        const { name, email, password } = data
        const res = await signUp.email({
            name,
            email,
            password,
        })
        if (!res.data) setError(res.error?.message)
        else toast.success("Successfully created account")
        setSubmitting(false)
    }

    return (
        <Card className="overflow-hidden p-0">
            <CardContent className="grid md:grid-cols-2 p-0">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col justify-center p-7">
                            <h1 className="text-xl font-bold text-foreground">Welcome !</h1>
                            <p className="pb-7 text-muted-foreground text-balance">Create your account.</p>
                            <div className="flex flex-col gap-7">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="xyz@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}

                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}

                                />
                                {error && <Alert className="bg-destructive/10">
                                    <OctagonAlertIcon className="!text-destructive" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>}
                                <Button type="submit" disabled={submitting}>Sign Up{submitting && <LoaderCircle className="animate-spin" />}</Button>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 px-2 bg-card text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant={'outline'}>
                                        Google
                                    </Button>
                                    <Button variant={'outline'}>
                                        Github
                                    </Button>
                                </div>
                                <div className="text-center">
                                    Already have an account ? <Link href={"/sign-in"} className="underline underline-offset-4">Sign in</Link>
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