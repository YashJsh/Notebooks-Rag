import type { Context } from "hono"
import { client } from "../lib/prisma";
import { SignInSchema, SignUpSchema } from "../schema/auth.schema";
import { encryptPassword, comparePassword } from "../lib/encryption";
import { ZodError } from "zod";
import { createAccessToken, createRefreshToken } from "../lib/tokenManagment";
import { APIResponse } from "../utils/apiResponse";
import { APIError } from "../utils/apiError";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { asyncHandler } from "../utils/asyncHandler";

export const signUpController = asyncHandler(async (c: Context) => {
    const body = await c.req.json();
    const parsedBody = SignUpSchema.parse(body);

    const user = await client.user.findUnique({
        where: {
            email: parsedBody.email
        }
    });
    if (user) {
        throw new APIError(409, "User already exists");
    };
    const encrypt = await encryptPassword(parsedBody.password);
    const newUser = await client.user.create({
        data: {
            email: parsedBody.email,
            password: encrypt!,
        }
    });

    return c.json(new APIResponse({
        email: newUser.email,
        id: newUser.id,
    }, "User Registered Successfully"), 201)
    // return c.json({
    //     success : true,
    //     data : {
    //         email : newUser.email,
    //         id : newUser.id,
    //         token : token
    //     }
    // }, 201);
})


export const signInController = asyncHandler(async (c: Context) => {
    const body = await c.req.json();
    const parsedBody = SignInSchema.parse(body);
    const user = await client.user.findUnique({
        where: {
            email: parsedBody.email
        }
    });
    if (!user) {
        console.log("User not found");
        throw new APIError(404, "User not found");
    }
    const check = await comparePassword(parsedBody.password, user.password);
    if (!check) {
        console.log("Incorrect Password");
        throw new APIError(401, "Incorrect Password");
    };

    const accessToken = await createAccessToken({ email: user.email, id: user.id });
    const refreshToken = await createRefreshToken({ email: user.email, id: user.id });

    const loggedInUser = await client.user.update({
        where : {
            id : user.id,
            email : user.email
        },
        data : {
            refreshToken
        },
    });

    setCookie(c, "accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1800,
    });
    setCookie(c, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60,
    });

    return c.json(new APIResponse(
        {
            email: loggedInUser.email,
            id: user.id,
            refreshToken : loggedInUser.refreshToken,
            accessToken : accessToken
        },
        "Logged In successfully"
    ), 200)
})