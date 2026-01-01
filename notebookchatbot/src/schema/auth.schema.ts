import * as z from "zod";

export const SignUpSchema = z.object({
    email : z.email(),
    password : z.string().min(5),
    name : z.string()
});

export const SignInSchema = z.object({
    email : z.email(),
    password : z.string()
});