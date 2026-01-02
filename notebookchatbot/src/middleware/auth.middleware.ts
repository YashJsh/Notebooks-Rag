import type { Context, Next } from "hono"
import { verifyToken } from "../lib/tokenManagment";
import { client } from "../lib/prisma";

export const authMiddleware = async (c : Context, next : Next)=>{
    try {
        const token = await c.req.header('Authorization');
        if (!token){
            return c.json({
                "success" : "false",
                "error" : "token not present"
            }, 403)
        };
        const data  = await verifyToken(token);
        if (!data){
            return c.json({
                "success" : "false",
                "error" : "Incorrect Token"
            }, 403)
        };
        console.log("Decoded data is : ", data);
        console.log(token);

        const user = await client.user.findUnique({
            where : {
                id : data.id,
                email : data.email
            }
        })
        if (!user){
            return c.json({
                success : "false", 
                error : "Not found"
            }, 401)
        };
        c.set("id", user.id);
        c.set("email", user.email);
        return await next();
    } catch (error) {
        console.warn("error is :",error);
        return c.json({
            "success" : false,
            "error" : error
        }, 500)
    }
};