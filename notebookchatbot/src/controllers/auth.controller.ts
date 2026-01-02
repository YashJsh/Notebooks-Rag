import type { Context } from "hono"
import { client } from "../lib/prisma";
import { SignInSchema, SignUpSchema } from "../schema/auth.schema";
import { encryptPassword, comparePassword } from "../lib/encryption";
import { ZodError } from "zod";
import { createToken } from "../lib/tokenManagment";

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
            return c.json({
                success : false,
                message : "User already exists"
            }, 409)
        };
        const encrypt = await encryptPassword(parsedBody.password);
        const newUser = await client.user.create({
            data : {
                email : parsedBody.email,
                password : encrypt!,
            }
        });
        const token = await createToken({email : newUser.email, id : newUser.id})
        return c.json({
            success : true,
            data : {
                email : newUser.email,
                id : newUser.id,
                token : token
            }
        }, 201);

    } catch (error) {
        if (error instanceof ZodError){
            console.log(error);
            return c.json({
                success : false,
                error : error
            }, 500)
        }
        console.log(error);
        return c.json({
            success : false,
            error : error
        }, 500)
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
            return c.json({
                success : false,
                message : "User Not found"
            }, 404)
        }
        const check = await comparePassword(parsedBody.password, user.password);
        if (!check){
            return c.json({
                success : false,
                message : "Incorrect Password"
            }, 401)
        };
        const token = await createToken({email : user.email, id : user.id})
        console.log(token);
        return c.json({
            success : "true",
            data : {
                email : user.email,
                id : user.id,
                token
            }
        });
    } catch (error) {
        if (error instanceof ZodError){
            console.log(error);
            return c.json({
                success : false,
                error : error
            }, 500)
        }
        console.log(error);
        return c.json({
            success : false,
            error : error
        }, 500)
    }
}