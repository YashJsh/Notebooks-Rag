import type { Context } from "hono"
import { client } from "../lib/prisma";
import { SignInSchema, SignUpSchema } from "../schema/auth.schema";
import { encryptPassword, comparePassword } from "../lib/encryption";
import { ZodError } from "zod";
import { createToken } from "../lib/tokenManagment";
import { APIResponse } from "../utils/apiResponse";
import { APIError } from "../utils/apiError";

export const signUpController = async (c : Context)=>{
    try {
        const body = await c.req.json();
        const parsedBody = SignUpSchema.parse(body);
        
        const user = await client.user.findUnique({
            where : {
                email : parsedBody.email
            }
        });
        if (user){
            throw new APIError(409, "User already exists");
        };
        const encrypt = await encryptPassword(parsedBody.password);
        const newUser = await client.user.create({
            data : {
                email : parsedBody.email,
                password : encrypt!,
            }
        });
        const token = await createToken({email : newUser.email, id : newUser.id})
        
        return c.json(new APIResponse(201, {
            email : newUser.email,
            id : newUser.id,
            token
        }, "User created Successfully"))
        // return c.json({
        //     success : true,
        //     data : {
        //         email : newUser.email,
        //         id : newUser.id,
        //         token : token
        //     }
        // }, 201);

    } catch (error) {
        if (error instanceof ZodError){
            throw new APIError(
                400,
                "Invalid request data",
                [error]
            );
        }
        console.log(error);
        throw new APIError(500, "Something went wrong", [error]);
    }
}

export const signInController = async (c : Context) =>{
    try {
        const body = await c.req.json();
        const parsedBody = SignInSchema.parse(body);
        const user = await client.user.findUnique({
            where : {
                email : parsedBody.email
            }
        });
        if (!user){
            console.log("User not found");
            throw new APIError(404, "User not found");
        }
        const check = await comparePassword(parsedBody.password, user.password);
        if (!check){
            console.log("Incorrect Password");
            throw new APIError(401, "Incorrect Password");
        };
        const token = await createToken({email : user.email, id : user.id})
        console.log("token : ",token);
        return c.json(new APIResponse(
            200,
            {
                email : user.email,
                id : user.id,
                token
            },
            "Logged In successfully"
        ))
    } catch (error) {
        if (error instanceof ZodError){
            console.log(error);
            throw new APIError(400, "Invalid request data", [error]);
        }
        console.log(error);
        throw new APIError(500, "Internal Server Error", [error])
    }
}