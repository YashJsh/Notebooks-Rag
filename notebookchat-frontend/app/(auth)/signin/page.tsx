"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInType } from "@/types/auth.types";
import { useSignIn } from "@/hooks/useAuthMutation";


const SignUp = () => {
    const { mutate, isPending, error } = useSignIn();

    const {handleSubmit, register, formState:{errors}} = useForm<signInType>({
        resolver : zodResolver(signInSchema)
    });

    const onSubmit = (data : signInType)=>{
        mutate(data);
    }

    return (
        <Card className="w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Log In to explore your workspace
            </CardDescription>
          </CardHeader>
    
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input {...register("email")}
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  className="h-11 rounded-lg w-full border px-2"
                />
                 {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
    
              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input {...register("password")}
                  id="password"
                  type="password"
                  placeholder="**********"
                  className="h-11 rounded-lg w-full border px-2"
                />
                {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>
    
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-lg font-medium transition-all"
              >
                {isPending ? "Logging In…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
    
          <CardFooter className="pt-6">
            <p className="w-full text-center text-sm text-muted-foreground">
              Don't have an account? {" "}
              <Link href={"/signup"} className="font-medium text-foreground underline underline-offset-4 hover:opacity-80">SignUp</Link>
            </p>
          </CardFooter>
        </Card>
      );
}

export default SignUp