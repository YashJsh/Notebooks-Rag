
import jwt, { verify } from "jsonwebtoken";
import { z } from "zod";
import { APIError } from "../utils/apiError";

const AuthPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

export const createAccessToken = async (data : {email : string, id : string})=>{
    const token = await jwt.sign(
      data,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn : 1800
      }
    );
    return token;
};

export const createRefreshToken = async (data : {email : string, id : string})=>{
  const token = await jwt.sign(
    data,
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn : "7d"
    }
  );
  return token;
};

export const verifyToken = async (
  token: string
): Promise<AuthPayload | null> => {
  try {
    const data = await verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return data as AuthPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (token : string) : Promise<AuthPayload | null>=>{
  try{
    const data = await verify(token, process.env.REFRESH_TOKEN_SECRET!);
    return data as AuthPayload;
  }catch(error : any){
    throw new APIError(401, "Wrong refresh Token", error.message)
  }
}
