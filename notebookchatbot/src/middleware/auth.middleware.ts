import type { Context, Next } from "hono"
import { verifyToken } from "../lib/tokenManagment";
import { client } from "../lib/prisma";
import { APIError } from "../utils/apiError";

export const authMiddleware = async (c : Context, next : Next)=>{
    try {
        // Token from the header
        const token = await c.req.header('Authorization');
        if (!token){
            throw new APIError(403, "Token NOT Found");
        };
        // Verifying Token
        const data  = await verifyToken(token);
        if (!data){
            throw new APIError(403, "Incorrect Token");
        };

        console.log("Decoded data is : ", data);
        console.log(token);

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
        console.warn("error is :",error);
        throw new APIError(500)
    }
};