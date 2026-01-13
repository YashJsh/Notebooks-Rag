import type { Context, Next } from "hono"
import { verifyToken, verifyRefreshToken, createAccessToken } from "../lib/tokenManagment";
import { client } from "../lib/prisma";
import { APIError } from "../utils/apiError";
import { getCookie } from "hono/cookie";


export const authMiddleware = async (c : Context, next : Next)=>{
    try {
        let token = getCookie(c, "accessToken");
        
        // If no access token, try to refresh using refresh token
        if (!token) {
            const refreshToken = getCookie(c, "refreshToken");
            if (!refreshToken) {
                throw new APIError(401, "No tokens provided");
            }

            // Verify refresh token and get user
            const userPayload = await verifyRefreshToken(refreshToken);
            if (!userPayload) {
                throw new APIError(401, "Invalid refresh token");
            }

            const user = await client.user.findUnique({
                where: {
                    id: userPayload.id,
                    email: userPayload.email,
                    refreshToken: refreshToken
                }
            });

            if (!user) {
                throw new APIError(401, "User not found or refresh token mismatch");
            }

            c.set("id", user.id);
            c.set("email", user.email);
            return await next();
        }
        
        // Verifying Token
        const data  = await verifyToken(token);
        if (!data){
            throw new APIError(403, "Incorrect Token");
        };

        //Search if client exists
        const user = await client.user.findUnique({
            where : {
                id : data.id,
                email : data.email
            }
        })
        // If not send error
        if (!user){
            throw new APIError(401, "User not found")
        };

        //Set id and email in request
        c.set("id", user.id);
        c.set("email", user.email);
        return await next();
    } catch (error) {
        console.warn("Auth middleware error:", error);
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(500, "Authentication failed");
    }
};