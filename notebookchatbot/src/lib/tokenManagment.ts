import { decode, sign, verify } from 'hono/jwt';
import { z } from "zod";


const secret = "hadsfw1123qsd";

const AuthPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

export const createToken = async (data : {email : string, id : string})=>{
    const token = await sign(data, secret);
    return token;
};


export const verifyToken = async (
  token: string
): Promise<AuthPayload | null> => {
  try {
    const data = await verify(token, secret);
    return data as AuthPayload;
  } catch {
    return null;
  }
};
