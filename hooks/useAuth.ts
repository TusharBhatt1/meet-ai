import { signIn, signUp } from "@/lib/auth-client";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";

export const signInformSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpformSchema = z
  .object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const useAuth = () => {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const signInform = useForm<z.infer<typeof signInformSchema>>({
    resolver: zodResolver(signInformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpform = useForm<z.infer<typeof signUpformSchema>>({
    resolver: zodResolver(signUpformSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //@ts-expect-error later
  const onSubmit = async (data, type: "signIn" | "signUp") => {
    setSubmitting(true);
    const res =
      type === "signIn"
        ? await signIn.email({
            ...data,
          })
        : await signUp.email({
            ...data,
          });
    if (!res.data) setError(res.error?.message);
    else redirect("/");
    setSubmitting(false);
  };

  const onSocial = async (social: "google" | "github") => {
    {
      await signIn.social({
        provider: social,
      });
    }
  };

  return {
    error,
    setError,
    submitting,
    setSubmitting,
    onSubmit,
    signInform,
    signUpform,
    onSocial,
  };
};
export default useAuth;
